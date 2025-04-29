/**
 * Evaluation utils for the Humanloop SDK.
 *
 * This module provides a set of utilities to aid running Eval workflows on Humanloop
 * where you are managing the runtime of your application in your code.
 *
 * Functions in this module should be accessed via the Humanloop client. They should
 * not be called directly.
 */
import cliProgress from "cli-progress";
import _, { capitalize } from "lodash";

import {
    AgentResponse,
    BooleanEvaluatorStatsResponse,
    CreateEvaluationRequestEvaluatorsItem,
    DatapointResponse,
    DatasetResponse,
    EvaluationResponse,
    EvaluationRunResponse,
    EvaluationStats,
    EvaluatorArgumentsType,
    EvaluatorRequest,
    EvaluatorResponse,
    EvaluatorReturnTypeEnum,
    ExternalEvaluatorRequest,
    FileType,
    FlowLogRequest,
    FlowRequest,
    FlowResponse,
    LogResponse,
    NumericEvaluatorStatsResponse,
    PromptLogRequest,
    PromptRequest,
    PromptResponse,
    RunStatsResponse,
    ToolLogRequest,
    ToolRequest,
    ToolResponse,
} from "../api";
import {
    EvaluationContext,
    HL_CONTEXT,
    getEvaluationContext,
    setEvaluationContext,
} from "../context";
import { HumanloopRuntimeError } from "../error";
import { Humanloop, HumanloopClient } from "../index";
import {
    Dataset,
    EvalFileType,
    Evaluator,
    EvaluatorCheck,
    File as FileEvalConfig,
    LocalEvaluator,
    LocalEvaluatorReturnTypeEnum,
    OnlineEvaluator,
} from "./types";

// ANSI escape codes for logging colors
const YELLOW = "\x1b[93m";
const CYAN = "\x1b[96m";
const GREEN = "\x1b[92m";
const RED = "\x1b[91m";
const RESET = "\x1b[0m";

export async function runEval<
    I extends Record<string, unknown> & { messages?: any[] },
    O,
>(
    client: HumanloopClient,
    fileConfig: FileEvalConfig<I, O>,
    dataset: Dataset,
    name?: string,
    evaluators: (
        | OnlineEvaluator
        | LocalEvaluator<LocalEvaluatorReturnTypeEnum, EvaluatorArgumentsType>
    )[] = [],
    concurrency: number = 8,
): Promise<EvaluatorCheck[]> {
    if (concurrency > 32) {
        console.log("Warning: Too many parallel workers, capping the number to 32.");
    }
    concurrency = Math.min(concurrency, 32);

    const [hlFile, function_] = await getHLFile(client, fileConfig);
    if (hlFile.type === "flow" && !function_) {
        throw new HumanloopRuntimeError(
            "Flows can only be evaluated locally, please provide a callable inside `file` argument.",
        );
    }
    const type_ = hlFile.type as FileType;

    let hlDataset: DatasetResponse;
    try {
        hlDataset = await upsertDataset({ dataset: dataset, client: client });
    } catch (e: any) {
        console.error(
            `${RED}Error in your \`file\` argument:\n\n${e.constructor.name}: ${e.message}${RESET}`,
        );
        return [];
    }

    let localEvaluators: _LocalEvaluator[];
    try {
        localEvaluators = await upsertLocalEvaluators({
            evaluators: evaluators.filter(
                (evaluator) => "callable" in evaluator,
            ) as LocalEvaluator<LocalEvaluatorReturnTypeEnum, EvaluatorArgumentsType>[],
            client: client,
            // @ts-ignore
            callable: function_,
            type: type_,
        });
    } catch (e: any) {
        console.error(
            `${RED}Error in your \`file\` argument:\n\n${e.constructor.name} ${e.message}${RESET}`,
        );
        return [];
    }

    assertDatasetEvaluatorsFit(hlDataset, localEvaluators);

    const { evaluation, run } = await getNewRun({
        client,
        evaluationName: name,
        evaluators,
        hlFile,
        hlDataset,
        // @ts-ignore
        func: function_,
    });

    const runId = run.id;

    function cancelEvaluation() {
        client.evaluations.updateEvaluationRun(evaluation.id, runId, {
            status: "cancelled",
        });
    }

    function handleExitSignal(signum: number) {
        process.stderr.write(
            `\n${RED}Received signal ${signum}, cancelling the Evaluation...${RESET}\n`,
        );
        cancelEvaluation();
        process.exit(signum);
    }

    process.on("SIGINT", handleExitSignal);
    process.on("SIGTERM", handleExitSignal);

    // Header of the CLI report
    console.log(`\n${CYAN}Navigate to your Evaluation:${RESET}\n${evaluation.url}\n`);
    console.log(
        `${CYAN}${type_.charAt(0).toUpperCase() + type_.slice(1)} Version ID: ${
            hlFile.versionId
        }${RESET}`,
    );
    console.log(`${CYAN}Run ID: ${runId}${RESET}`);

    // Generate locally if a file `callable` is provided
    if (function_ === undefined) {
        // TODO: trigger run when updated API is available
        process.stdout.write(
            `${CYAN}\nRunning '${hlFile.name}' ${_.capitalize(hlFile.type)} over the '${hlDataset.name}' Dataset${RESET}\n`,
        );
    } else {
        // Running the evaluation locally
        process.stdout.write(
            `${CYAN}\nRunning '${hlFile.name}' ${_.capitalize(hlFile.type)} over the '${hlDataset.name}' Dataset locally...${RESET}\n\n`,
        );
    }

    // Configure the progress bar
    const progressBar = new cliProgress.SingleBar(
        {
            format:
                "Progress |" +
                "{bar}" +
                "| {percentage}% || {value}/{total} Datapoints",
        },
        cliProgress.Presets.shades_classic,
    );

    async function processDatapoint(
        datapoint: DatapointResponse,
        runId: string,
    ): Promise<void> {
        async function uploadCallback(logId: string) {
            await runLocalEvaluators(client, logId, datapoint, localEvaluators);
            progressBar.increment();
        }

        if (function_ === undefined) {
            throw new HumanloopRuntimeError(
                `\`file.callable\` is undefined. Please provide a callable for your file.`,
            );
        }

        const logFunc = getLogFunction(
            client,
            type_,
            hlFile.id,
            hlFile.versionId,
            runId,
        );

        if (datapoint.inputs === undefined) {
            throw new Error(`Datapoint 'inputs' attribute is undefined.`);
        }

        HL_CONTEXT.with(
            setEvaluationContext(
                new EvaluationContext({
                    sourceDatapointId: datapoint.id,
                    runId,
                    evalCallback: uploadCallback,
                    fileId: hlFile.id,
                    path: hlFile.path,
                }),
            ),
            async () => {
                const startTime = new Date();
                let funcInputs: Record<string, unknown> & {
                    messages?: Humanloop.ChatMessage[];
                } = {
                    ...datapoint.inputs,
                };
                if ("messages" in datapoint) {
                    funcInputs = {
                        ...funcInputs,
                        messages: datapoint.messages,
                    };
                }

                const evaluationContext = getEvaluationContext();
                if (!evaluationContext) {
                    throw new Error(
                        "Internal error: evaluation context is not set while processing a datapoint.",
                    );
                }

                try {
                    const output = await callFunction(function_, datapoint);

                    if (!evaluationContext.logged) {
                        const log = await logFunc({
                            inputs: { ...datapoint.inputs },
                            messages: datapoint.messages,
                            output: output,
                            sourceDatapointId: datapoint.id,
                            runId: runId,
                            startTime: startTime,
                            endTime: new Date(),
                            logStatus: "complete",
                        });
                        // @ts-ignore
                        evaluationContext._callback(log.id);
                    }
                } catch (e: any) {
                    if (e instanceof HumanloopRuntimeError) {
                        throw e;
                    }
                    const errorMessage = e instanceof Error ? e.message : String(e);
                    const log = await logFunc({
                        inputs: { ...datapoint.inputs },
                        messages: datapoint.messages,
                        error: errorMessage,
                        sourceDatapointId: datapoint.id,
                        runId: runId,
                        startTime: startTime,
                        endTime: new Date(),
                        logStatus: "complete",
                    });
                    // @ts-ignore
                    evaluationContext._callback(log.id);
                    console.warn(
                        `\nYour ${type_}'s callable failed for Datapoint: ${datapoint.id}.\nError: ${errorMessage}`,
                    );
                }
            },
        );
    }

    // Generate locally if a function is provided
    if (function_) {
        const totalDatapoints = hlDataset.datapoints!.length;
        progressBar.start(totalDatapoints, 0);

        await pMap(
            hlDataset.datapoints!,
            async (datapoint) => {
                await processDatapoint(datapoint, runId);
            },
            { concurrency: concurrency },
        );
        progressBar.stop();
    }

    // Wait for the Evaluation to complete then print the results
    let stats;
    do {
        stats = await client.evaluations.getStats(evaluation.id);
        if (stats?.progress) {
            const newLines = stats.progress.split("\n").length - 1;
            process.stdout.write(`\r${stats.progress}`);
            // Move the cursor up by the number of new lines
            process.stdout.moveCursor(0, -newLines);
        }
        if (stats.status !== "completed") {
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
    } while (stats.status !== "completed");
    console.log(stats.report);

    const checks: EvaluatorCheck[] = [];
    if (
        evaluators.some((evaluator) => evaluator.threshold !== undefined) ||
        stats.runStats.length > 1
    ) {
        for (const evaluator of evaluators) {
            const [_, score, delta] = checkEvaluationImprovement(
                evaluation,
                evaluator.path!,
                stats,
                runId,
            );
            let thresholdCheck = undefined;
            if (evaluator.threshold !== undefined) {
                thresholdCheck = score >= evaluator.threshold;
                thresholdCheck = checkEvaluationThreshold(
                    evaluation,
                    stats,
                    evaluator.path!,
                    evaluator.threshold,
                    runId,
                );
            }
            checks.push({
                path: evaluator.path!,
                // TODO: Add back in with number valence on Evaluators
                // improvementCheck: improvementCheck,
                score: score,
                delta: delta,
                threshold: evaluator.threshold,
                thresholdCheck: thresholdCheck,
                evaluationId: evaluation.id,
            });
        }
    }

    console.info(`\n${CYAN}View your Evaluation:${RESET}\n${evaluation.url}\n`);
    return checks;
}

/**
 * Maps over an array of items with a concurrency limit, applying an asynchronous mapper function to each item.
 *
 * @template T - The type of the items in the input array.
 * @template O - The type of the items in the output array.
 *
 * @param {T[]} iterable - The array of items to be mapped.
 * @param {(item: T) => Promise<O>} mapper - The asynchronous function to apply to each item.
 * @param {{ concurrency: number }} options - Options for the mapping operation.
 * @param {number} options.concurrency - The maximum number of promises to resolve concurrently.
 *
 * @returns {Promise<O[]>} A promise that resolves to an array of mapped items.
 *
 * @throws {TypeError} If the first argument is not an array.
 * @throws {TypeError} If the second argument is not a function.
 * @throws {TypeError} If the concurrency option is not a positive number.
 *
 * @description
 * The `pMap` function processes the input array in chunks, where the size of each chunk is determined by the `concurrency` option.
 * This controls how many promises are resolved at a time, which can help avoid issues such as rate limit errors when making server requests.
 */
async function pMap<T, O>(
    iterable: T[],
    mapper: (item: T) => Promise<O>,
    options: { concurrency: number },
): Promise<O[]> {
    const { concurrency } = options;

    if (!Array.isArray(iterable)) {
        throw new TypeError("Expected the first argument to be an array");
    }

    if (typeof mapper !== "function") {
        throw new TypeError("Expected the second argument to be a function");
    }

    if (typeof concurrency !== "number" || concurrency <= 0) {
        throw new TypeError("Expected the concurrency option to be a positive number");
    }

    const result: O[] = [];
    for (let i = 0; i < iterable.length; i += concurrency) {
        const chunk = iterable.slice(i, i + concurrency);
        try {
            const chunkResults = await Promise.all(chunk.map(mapper));
            result.push(...chunkResults);
        } catch (error) {
            // Handle individual chunk errors if necessary
            // For now, rethrow to reject the entire pMap promise
            throw error;
        }
    }
    return result;
}

function callableIsHumanloopDecorator<
    I extends Record<string, unknown> & { messages?: any[] },
    O,
>(file: FileEvalConfig<I, O>): boolean {
    return file.callable !== undefined && "file" in file.callable;
}

function fileOrFileInsideHLUtility<
    I extends Record<string, unknown> & { messages?: any[] },
    O,
>(file: FileEvalConfig<I, O>): FileEvalConfig<I, O> {
    if (callableIsHumanloopDecorator(file)) {
        // @ts-ignore
        const innerFile: FileEvalConfig<I, O> = file.callable!.file! as FileEvalConfig<
            I,
            O
        >;
        if ("path" in file && innerFile.path !== file.path) {
            throw new HumanloopRuntimeError(
                "`path` attribute specified in the `file` does not match the path of the decorated function. " +
                    `Expected \`${innerFile.path}\`, got \`${file.path}\`.`,
            );
        }
        if ("id" in file) {
            throw new HumanloopRuntimeError(
                "Do not specify an `id` attribute in `file` argument when using a decorated function.",
            );
        }
        if ("version" in file) {
            if (innerFile.type !== "prompt") {
                throw new HumanloopRuntimeError(
                    `Do not specify a \`version\` attribute in \`file\` argument when using a ${capitalize(innerFile.type)} decorated function.`,
                );
            }
        }
        if ("type" in file && innerFile.type !== file.type) {
            throw new HumanloopRuntimeError(
                "Attribute `type` of `file` argument does not match the file type of the decorated function. " +
                    `Expected \`${innerFile.type}\`, got \`${file.type}\`.`,
            );
        }
        const file_ = { ...innerFile };
        if (file_.type === "prompt") {
            console.warn(
                `${YELLOW}` +
                    "The @prompt decorator will not spy on provider calls when passed to `evaluations.run()`. " +
                    "Using the `version` in `file` argument instead.\n" +
                    `${RESET}`,
            );
            file_.version = file.version;
        }
        return file_;
    } else {
        const file_ = { ...file };
        if (!file_.path && !file_.id) {
            throw new HumanloopRuntimeError(
                "You must provide a path or id in your `file`.",
            );
        }
        return file_;
    }
}

function getFileType<I extends Record<string, unknown> & { messages?: any[] }, O>(
    file: FileEvalConfig<I, O>,
): FileEvalConfig<I, O> {
    // Determine the `type` of the `file` to Evaluate - if not `type` provided, default to `flow`
    try {
        let type_ = file.type as EvalFileType;
        console.info(
            `${CYAN}Evaluating your ${type_} function corresponding to \`${file.path || file.id}\` on Humanloop${RESET}\n\n`,
        );
        if (!type_) {
            type_ = "flow";
        }
        return {
            ...file,
            type: type_,
        };
    } catch (error) {
        const type_ = "flow";
        console.warn(
            `${YELLOW}No \`file\` type specified, defaulting to flow.${RESET}\n`,
        );
        return {
            ...file,
            type: type_,
        };
    }
}

function getFileCallable<I extends Record<string, unknown> & { messages?: any[] }, O>(
    file: FileEvalConfig<I, O>,
): FileEvalConfig<I, O>["callable"] {
    // Get the `callable` from the `file` to Evaluate
    const function_ = file.callable;
    const type_ = file.type;
    if (!function_) {
        if (type_ === "flow") {
            throw new Error(
                "You must provide a `callable` for your Flow `file` to run a local eval.",
            );
        } else {
            console.info(
                `${CYAN}No \`callable\` provided for your ${_.capitalize(type_)} file - will attempt to generate logs on Humanloop.\n\n${RESET}`,
            );
        }
    } else if (type_ === "agent") {
        throw new HumanloopRuntimeError(
            "Agent evaluation is only possible on the Humanloop runtime, do not provide a `callable`.",
        );
    }
    return function_;
}

type EvaluatedFile =
    | PromptResponse
    | FlowResponse
    | ToolResponse
    | EvaluatorResponse
    | AgentResponse;

/**
 * Check if the config object is valid, and resolve the File to be evaluated
 *
 * The callable will be undefined if the evaluation will happen on Humanloop runtime.
 * Otherwise, the evaluation will happen locally.
 */
async function getHLFile<I extends Record<string, unknown> & { message?: any[] }, O>(
    client: HumanloopClient,
    fileConfig: FileEvalConfig<I, O>,
): Promise<[EvaluatedFile, FileEvalConfig<I, O>["callable"]]> {
    let file_ = fileOrFileInsideHLUtility(fileConfig);
    file_ = getFileType(file_);

    return await resolveFile(client, file_);
}

/**
 * Get the appropriate subclient based on file type.
 */
function getSubclient<I extends Record<string, unknown> & { message?: any[] }, O>(
    client: HumanloopClient,
    fileConfig: FileEvalConfig<I, O>,
) {
    const type = fileConfig.type;
    switch (type) {
        case "prompt":
            return client.prompts;
        case "flow":
            return client.flows;
        case "agent":
            return client.agents;
        default:
            throw new HumanloopRuntimeError(`Unsupported file type: ${type}`);
    }
}

/**
 * Get default version of a File from online workspace.
 *
 * Uses either the File path or id from the config.
 *
 * Raise error if the File is not of the expected type, or if the user has provided both a path and an id.
 */
async function safeGetDefaultFileVersion<
    I extends Record<string, unknown> & { message?: any[] },
    O,
>(client: HumanloopClient, fileConfig: FileEvalConfig<I, O>) {
    const path = fileConfig.path;
    const type = fileConfig.type;
    const fileId = fileConfig.id;

    if (!path && !fileId) {
        throw new HumanloopRuntimeError(
            `You must provide a path or id in your \`file\`.`,
        );
    }

    if (path) {
        let hlFile = await client.files.retrieveByPath({ path: path });
        if (hlFile.type !== type) {
            throw new HumanloopRuntimeError(
                `File in Humanloop workspace at ${path} is not of type ${type}, but ${hlFile.type}.`,
            );
        }
        return hlFile;
    } else if (fileId) {
        const subclient = getSubclient(client, fileConfig);
        return await subclient.get(fileId!);
    } else {
        throw new HumanloopRuntimeError(
            "Either a path or file ID should be provided in your File eval config",
        );
    }
}

/**
 * Resolve the File to be evaluated. Will return a FileResponse and an optional callable.
 *
 * If the callable is null, the File will be evaluated on Humanloop. Otherwise, the File will be evaluated locally.
 */
async function resolveFile<I extends Record<string, unknown> & { message?: any[] }, O>(
    client: HumanloopClient,
    fileConfig: FileEvalConfig<I, O>,
): Promise<[EvaluatedFile, FileEvalConfig<I, O>["callable"]]> {
    const fileId = fileConfig.id;
    const path = fileConfig.path;
    const versionId = fileConfig.versionId;
    const environment = fileConfig.environment;
    const callable = getFileCallable(fileConfig);
    const version = fileConfig.version;

    if (callable && !path && !fileId) {
        throw new HumanloopRuntimeError(
            `You are trying to create a new version of the File by passing the ${callable} argument. You must pass either the \`file.path\` or \`file.fileId\` argument and provide proper \`file.version\` for upserting the File.`,
        );
    }

    if ((versionId || environment) && (callable || version)) {
        throw new HumanloopRuntimeError(
            "You are trying to create a local Evaluation while requesting a specific File version by version ID or environment.",
        );
    }

    let hlFile: EvaluatedFile;

    try {
        hlFile = (await safeGetDefaultFileVersion(client, fileConfig)) as EvaluatedFile;
    } catch (error: any) {
        if (!version || !path || fileId) {
            throw new HumanloopRuntimeError(
                "File does not exist on Humanloop. Please provide a `file.path` and a version to create a new version.",
            );
        }
        console.log("UPSERTING FILE", JSON.stringify(fileConfig, null, 2));
        return [await upsertFile(client, fileConfig), callable];
    }

    if (version) {
        // User responsibility to provide adequate file.version for upserting the file
        console.info(
            `${CYAN}Upserting a new File version based on \`file.version\`. Will use provided callable for generating Logs.${RESET}\n`,
        );
        try {
            return [
                await upsertFile(client, fileConfig),
                callable ? callable : undefined,
            ];
        } catch (error: any) {
            throw new HumanloopRuntimeError(
                `Error upserting File. Please ensure \`file.version\` is valid: ${error.toString()}`,
            );
        }
    }

    if (!versionId && !environment) {
        // Return default version of the file
        return [hlFile as unknown as EvaluatedFile, callable];
    }

    if (!fileId && (versionId || environment)) {
        throw new HumanloopRuntimeError(
            "You must provide the `file.id` when addressing a file by version ID or environment",
        );
    }

    // Use version_id or environment to retrieve specific version of the File
    const subclient = getSubclient(client, fileConfig);
    // Let backend handle case where both or none of version_id and environment are provided
    return [await subclient.get(fileId!, { versionId, environment }), undefined];
}

async function callFunction<
    I extends Record<string, unknown> & { messages?: any[] },
    O,
>(
    callable: FileEvalConfig<I, O>["callable"],
    datapoint: DatapointResponse,
): Promise<string> {
    const datapointDict = { ...datapoint };
    let output;
    if (callable === undefined) {
        throw new HumanloopRuntimeError(
            `\`file.callable\` is undefined. Please provide a callable for your file.`,
        );
    }
    if ("messages" in datapointDict && !!datapointDict["messages"]) {
        output = await callable({
            ...datapointDict["inputs"],
            messages: datapointDict["messages"],
        } as unknown as I);
    } else {
        output = await callable({ ...datapointDict["inputs"] } as unknown as I);
    }

    if (typeof output !== "string") {
        try {
            output = JSON.stringify(output);
        } catch (error) {
            throw new HumanloopRuntimeError(
                `\`file.callable\` must return a string or a JSON serializable object.`,
            );
        }
    }
    return output;
}

async function upsertFile<I extends Record<string, unknown> & { messages?: any[] }, O>(
    client: HumanloopClient,
    fileConfig: FileEvalConfig<I, O>,
): Promise<PromptResponse | FlowResponse | ToolResponse | EvaluatorResponse> {
    // Get or create the file on Humanloop
    const version = fileConfig.version || {};
    const fileDict = { ...fileConfig, ...version };
    const type = fileConfig.type;

    let hlFile: PromptResponse | FlowResponse | ToolResponse | EvaluatorResponse;
    switch (type) {
        case "flow":
            // Be more lenient with Flow versions as they are arbitrary json
            const flowVersion = version ? { ...version } : { attributes: {} };
            const fileDictWithFlowVersion = { ...fileConfig, ...flowVersion };
            hlFile = await client.flows.upsert(fileDictWithFlowVersion as FlowRequest);
            break;
        case "prompt":
            hlFile = await client.prompts.upsert(fileDict as PromptRequest);
            break;
        case "tool":
            hlFile = await client.tools.upsert(fileDict as ToolRequest);
            break;
        default:
            throw new HumanloopRuntimeError(`Unsupported File type: ${type}`);
    }

    return hlFile;
}

async function upsertDataset({
    dataset,
    client,
}: {
    dataset: Dataset;
    client: HumanloopClient;
}): Promise<DatasetResponse> {
    // Upsert the Dataset
    if (!dataset.action) {
        dataset.action = "set";
    }
    if (!dataset.datapoints) {
        dataset.datapoints = [];
        // Use `upsert` to get existing dataset ID if no datapoints provided, given we can't `get` on path.
        dataset.action = "add";
    }
    const hlDataset = await client.datasets.upsert({
        ...dataset,
        datapoints: dataset.datapoints || [],
    });
    return await client.datasets.get(hlDataset.id, {
        versionId: hlDataset.versionId,
        includeDatapoints: true,
    });
}

type _LocalEvaluator = {
    hlEvaluator: EvaluatorResponse;
    // @ts-ignore
    function: (params: {
        log: LogResponse;
        datapoint?: DatapointResponse;
    }) => Promise<string | number | boolean>;
};

async function getNewRun({
    client,
    evaluationName,
    evaluators,
    hlFile,
    hlDataset,
    func,
}: {
    client: HumanloopClient;
    evaluationName: string | undefined;
    evaluators: Evaluator[];
    hlFile: EvaluatedFile;
    hlDataset: DatasetResponse;
    func: ((inputs: Record<string, unknown>) => Promise<unknown>) | undefined;
}): Promise<{ evaluation: EvaluationResponse; run: EvaluationRunResponse }> {
    // Get or create the Evaluation based on the name
    let evaluation: EvaluationResponse | null = null;
    try {
        evaluation = await client.evaluations.create({
            name: evaluationName,
            evaluators: evaluators.map(
                (evaluator) =>
                    ({
                        path: evaluator.path,
                        id: evaluator.id,
                    }) as CreateEvaluationRequestEvaluatorsItem,
            ),
            file: { id: hlFile.id },
        });
    } catch (error: any) {
        // If the name exists, go and get it
        // TODO: Update API GET to allow querying by name and file.
        if (error.statusCode === 409) {
            const evals = await client.evaluations.list({
                fileId: hlFile.id,
                size: 50,
            });
            for await (const e of evals) {
                if (e.name === evaluationName) {
                    evaluation = e;
                    break;
                }
            }
        } else {
            throw error;
        }
        if (!evaluation) {
            throw new Error(`Evaluation with name ${evaluationName} not found.`);
        }
    }

    // Create a new Run
    const run: EvaluationRunResponse = await client.evaluations.createRun(
        evaluation.id,
        {
            dataset: { versionId: hlDataset.versionId },
            version: { versionId: hlFile.versionId },
            orchestrated: func ? false : true,
            useExistingLogs: false,
        },
    );

    return { evaluation, run };
}

async function upsertLocalEvaluators<
    I extends Record<string, unknown> & { messages?: any[] },
    O,
>({
    evaluators,
    callable,
    type,
    client,
}: {
    evaluators: LocalEvaluator<LocalEvaluatorReturnTypeEnum, EvaluatorArgumentsType>[];
    callable: FileEvalConfig<I, O>["callable"];
    type: FileType;
    client: HumanloopClient;
}): Promise<_LocalEvaluator[]> {
    // Upsert the local Evaluators; other Evaluators are just referenced by `path` or `id`
    const localEvaluators: _LocalEvaluator[] = [];
    if (evaluators) {
        for (const evaluatorRequest of evaluators) {
            // If a callable is provided for an Evaluator, we treat it as External
            const evalFunction = evaluatorRequest.callable;
            if (evalFunction !== undefined) {
                // TODO: support the case where `file` logs generated on Humanloop but Evaluator logs generated locally
                if (callable === undefined) {
                    throw new Error(
                        `Local Evaluators are only supported when generating Logs locally using your ${type}'s callable. Please provide a callable for your file in order to run Evaluators locally.`,
                    );
                }
                const spec: ExternalEvaluatorRequest = {
                    argumentsType: evaluatorRequest.argsType,
                    returnType: evaluatorRequest.returnType as EvaluatorReturnTypeEnum,
                    attributes: { code: evalFunction.toString() },
                    evaluatorType: "external",
                };
                const evaluator = await client.evaluators.upsert({
                    id: evaluatorRequest.id,
                    path: evaluatorRequest.path,
                    spec,
                });
                localEvaluators.push({
                    hlEvaluator: evaluator,
                    // @ts-ignore
                    function: evalFunction,
                });
            }
        }
    }
    return localEvaluators;
}

function assertDatasetEvaluatorsFit(
    hlDataset: DatasetResponse,
    localEvaluators: _LocalEvaluator[],
): void {
    // Validate upfront that the local Evaluators and Dataset fit
    const requiresTarget = localEvaluators.some(
        (localEvaluator) =>
            localEvaluator.hlEvaluator.spec.argumentsType === "target_required",
    );

    if (requiresTarget) {
        const missingTargets = (hlDataset.datapoints || []).filter(
            (datapoint) => !datapoint.target,
        ).length;

        if (missingTargets > 0) {
            throw new Error(
                `${missingTargets} Datapoints have no target. A target is required for the Evaluator: ${
                    localEvaluators.find(
                        (localEvaluator) =>
                            localEvaluator.hlEvaluator.spec.argumentsType ===
                            "target_required",
                    )?.hlEvaluator.path
                }`,
            );
        }
    }
}

/**
 * Returns the appropriate log function pre-filled with common parameters.
 *
 * @param client - The HumanloopClient instance used to make API calls.
 * @param type - The type of file for which the log function is being generated. Can be "flow", "prompt", or "tool".
 * @param fileId - The ID of the file.
 * @param versionId - The version ID of the file.
 * @param runId - The run ID associated with the log.
 * @returns A function that logs data to the appropriate endpoint based on the file type.
 * @throws {Error} If the provided file type is unsupported.
 */
function getLogFunction(
    client: HumanloopClient,
    type: FileType,
    fileId: string,
    versionId: string,
    runId: string,
) {
    const logRequest = {
        // TODO: why does the Log `id` field refer to the file ID in the API?
        // Why are both `id` and `version_id` needed in the API?
        id: fileId,
        versionId,
        runId,
    };

    switch (type) {
        case "flow":
            return async (args: FlowLogRequest) =>
                // @ts-ignore Using the original method instead of the overloaded one
                await client.flows._log({
                    ...logRequest,
                    logStatus: "complete",
                    ...args,
                });
        case "prompt":
            return async (args: PromptLogRequest) =>
                // @ts-ignore Using the original method instead of the overloaded one
                await client.prompts._log({ ...logRequest, ...args });
        // case "evaluator":
        //     return (args: CreateEvaluatorLogRequest) =>
        //         client.evaluators._log({ ...logRequest, ...args });
        case "tool":
            return async (args: ToolLogRequest) =>
                // @ts-ignore Using the original method instead of the overloaded one
                await client.tools._log({ ...logRequest, ...args });
        default:
            throw new Error(`Unsupported File version: ${type}`);
    }
}

async function runLocalEvaluators(
    client: HumanloopClient,
    logId: string,
    datapoint: DatapointResponse | undefined,
    localEvaluators: _LocalEvaluator[],
) {
    const log = await client.logs.get(logId);

    const promises = localEvaluators.map(
        async ({ hlEvaluator, function: evalFunction }) => {
            const startTime = new Date();
            let judgment: any | undefined;
            try {
                if (hlEvaluator.spec.argumentsType === "target_required") {
                    judgment = await evalFunction({ log, datapoint });
                } else {
                    judgment = await evalFunction({ log });
                }

                // @ts-ignore Using the original method instead of the overloaded one
                await client.evaluators._log({
                    path: hlEvaluator.path,
                    versionId: hlEvaluator.versionId,
                    parentId: logId,
                    judgment: judgment,
                    startTime: startTime,
                    endTime: new Date(),
                });
            } catch (e) {
                // @ts-ignore Using the original method instead of the overloaded one
                await client.evaluators._log({
                    path: hlEvaluator.path,
                    versionId: hlEvaluator.versionId,
                    parentId: logId,
                    error: e instanceof Error ? e.message : String(e),
                    startTime: startTime,
                    endTime: new Date(),
                });
                console.warn(`\nEvaluator ${hlEvaluator.path} failed with error ${e}`);
            }
        },
    );

    await Promise.all(promises);
}

function checkEvaluationImprovement(
    evaluation: EvaluationResponse,
    evaluatorPath: string,
    stats: EvaluationStats,
    runId: string,
): [boolean, number, number] {
    const runStats = stats.runStats.find((run) => run.runId === runId);
    if (!runStats) {
        throw new Error(`Run ${runId} not found in Evaluation ${evaluation.id}`);
    }
    const latestEvaluatorStatsByPath = getEvaluatorStatsByPath(runStats, evaluation);
    if (stats.runStats.length == 1) {
        console.log(`${YELLOW}⚠️ No previous versions to compare with.${RESET}`);
        return [true, 0, 0];
    }

    // Latest Run is at index 0, previous Run is at index 1
    const previousEvaluatorStatsByPath = getEvaluatorStatsByPath(
        stats.runStats[1],
        evaluation,
    );
    if (
        evaluatorPath in latestEvaluatorStatsByPath &&
        evaluatorPath in previousEvaluatorStatsByPath
    ) {
        const latestEvaluatorStats = latestEvaluatorStatsByPath[evaluatorPath];
        const previousEvaluatorStats = previousEvaluatorStatsByPath[evaluatorPath];
        const latestScore = getScoreFromEvaluatorStat(latestEvaluatorStats);
        const previousScore = getScoreFromEvaluatorStat(previousEvaluatorStats);
        if (latestScore === null || previousScore === null) {
            throw new Error(`Could not find score for Evaluator ${evaluatorPath}`);
        }
        let diff = latestScore - previousScore;
        // Round to 2 decimal places
        diff = Math.round(diff * 100) / 100;
        console.log(
            `${CYAN}Change of [${diff}] for Evaluator ${evaluatorPath}${RESET}`,
        );
        return [diff >= 0, latestScore, diff];
    } else {
        throw Error(`Evaluator ${evaluatorPath} not found in the stats.`);
    }
}

function getScoreFromEvaluatorStat(
    stat: NumericEvaluatorStatsResponse | BooleanEvaluatorStatsResponse,
): number | null {
    let score: number | null = null;
    if ("numTrue" in stat) {
        score =
            ((stat as BooleanEvaluatorStatsResponse).numTrue as number) /
            (stat as BooleanEvaluatorStatsResponse).totalLogs;
        // Round to 2 decimal places
        score = Math.round(score * 100) / 100;
    } else if ("mean" in stat && stat.mean !== undefined) {
        // Round to 2 decimal places
        score = Math.round(stat.mean * 100) / 100;
    } else {
        throw new Error(`Unexpected EvaluatorStats type: ${stat}`);
    }
    return score;
}

function getEvaluatorStatsByPath(
    stats: RunStatsResponse,
    evaluation: EvaluationResponse,
): { [key: string]: NumericEvaluatorStatsResponse | BooleanEvaluatorStatsResponse } {
    const evaluatorsById = {} as {
        [key: string]: Humanloop.EvaluationEvaluatorResponse;
    };
    for (const evaluator of evaluation.evaluators) {
        evaluatorsById[evaluator.version.versionId] = evaluator;
    }
    const evaluatorStatsByPath = {} as {
        [key: string]: NumericEvaluatorStatsResponse | BooleanEvaluatorStatsResponse;
    };
    for (const evaluatorStats of stats.evaluatorStats) {
        const evaluator = evaluatorsById[evaluatorStats.evaluatorVersionId];
        evaluatorStatsByPath[evaluator.version.path] = evaluatorStats as
            | NumericEvaluatorStatsResponse
            | BooleanEvaluatorStatsResponse;
    }
    return evaluatorStatsByPath;
}

function checkEvaluationThreshold(
    evaluation: EvaluationResponse,
    stats: EvaluationStats,
    evaluatorPath: string,
    threshold: number,
    runId: string,
) {
    const runStats = stats.runStats.find((run) => run.runId === runId);
    if (!runStats) {
        throw new Error(`Run ${runId} not found in Evaluation ${evaluation.id}`);
    }
    const evaluatorStatsByPath = getEvaluatorStatsByPath(runStats, evaluation);
    if (evaluatorPath in evaluatorStatsByPath) {
        const evaluatorStats = evaluatorStatsByPath[evaluatorPath];
        const score = getScoreFromEvaluatorStat(evaluatorStats);
        if (score === null) {
            throw new Error(`Could not find score for Evaluator ${evaluatorPath}`);
        }
        if (score >= threshold) {
            console.log(
                `${GREEN}✅ Latest eval [${score}] above threshold [${threshold}] for Evaluator ${evaluatorPath}.${RESET}`,
            );
        } else {
            console.log(
                `${RED}❌ Latest eval [${score}] below threshold [${threshold}] for Evaluator ${evaluatorPath}.${RESET}`,
            );
        }
        return score >= threshold;
    } else {
        throw new Error(`Evaluator ${evaluatorPath} not found in the stats.`);
    }
}
