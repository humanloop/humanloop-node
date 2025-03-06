/**
 * Evaluation utils for the Humanloop SDK.
 *
 * This module provides a set of utilities to aid running Eval workflows on Humanloop
 * where you are managing the runtime of your application in your code.
 *
 * Functions in this module should be accessed via the Humanloop client. They should
 * not be called directly.
 */
import * as contextApi from "@opentelemetry/api";
import cliProgress from "cli-progress";
import { Humanloop, HumanloopClient } from "index";
import _ from "lodash";

import {
    BooleanEvaluatorStatsResponse,
    DatapointResponse,
    DatasetResponse,
    EvaluationResponse,
    EvaluationStats,
    EvaluatorResponse,
    EvaluatorsRequest,
    ExternalEvaluatorRequest,
    FileType,
    FlowKernelRequest,
    FlowLogRequest,
    FlowRequest,
    LogResponse,
    NumericEvaluatorStatsResponse,
    PromptLogRequest,
    PromptRequest,
    RunStatsResponse,
    ToolKernelRequest,
    ToolLogRequest,
    ToolRequest,
} from "../api";
import { jsonifyIfNotString } from "../otel/helpers";
import {
    EvaluationContext,
    getEvaluationContext,
    setEvaluationContext,
} from "./context";
import { Dataset, Evaluator, EvaluatorCheck, File, FileResponse } from "./types";

// ANSI escape codes for logging colors
const YELLOW = "\x1b[93m";
const CYAN = "\x1b[96m";
const GREEN = "\x1b[92m";
const RED = "\x1b[91m";
const RESET = "\x1b[0m";

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

function callableIsHumanloopUtility(file: File): boolean {
    return file.callable !== undefined && "decorator" in file.callable;
}

function checkIfCallableIsHLDecorator(file: File): File {
    if (callableIsHumanloopUtility(file)) {
        // @ts-ignore
        const decorator = file.callable!.decorator as
            | {
                  type: "flow";
                  path: string;
                  version: FlowKernelRequest;
              }
            | {
                  type: "prompt";
                  path: string;
              }
            | {
                  type: "tool";
                  path: string;
                  version: ToolKernelRequest;
              };
        const path = decorator.path;
        const fileType = decorator.type;

        if (fileType === "prompt" && file.version === undefined) {
            throw new Error(
                "You must pass a `file.version` argument when `file.callable` is wrapped in th Prompt decorator",
            );
        }

        if (path !== file.path) {
            throw new Error(
                `Callable passed to Evaluation is wrapped in Humanloop ${fileType} decorator and manages File ${path}. ` +
                    `Passed argument \`file.path\` does not match: ${file.path}.`,
            );
        }

        for (const argument of ["type", "id"]) {
            if (argument in file) {
                console.warn(
                    `Callable passed to Evaluation is wrapped in Humanloop ${fileType} decorator and manages File ${path}. ` +
                        `Ignoring argument \`file.${argument}\`.`,
                );
            }
        }

        // If the callable is a Prompt decorator, we ask the user to pass file.version
        if (decorator.type !== "prompt") {
            for (const argument of ["version"]) {
                if (argument in file) {
                    console.warn(
                        `Callable passed to Evaluation is wrapped in Humanloop ${fileType} decorator and manages File ${path}. ` +
                            `Ignoring argument \`file.${argument}\`.`,
                    );
                }
            }
        }

        return {
            path: decorator.path,
            type: decorator.type,
            callable: file.callable!,
            version: decorator.type === "prompt" ? file.version : decorator.version,
        };
    } else {
        // Simple function
        // Raise error if one of path or id not provided
        if (!file.path && !file.id) {
            throw new Error("You must provide a `file.path` or `file.id` argument.");
        }
        return file;
    }
}

function capitalizeFirstLetter(input: string): string {
    if (!input) return input;
    return input.charAt(0).toUpperCase() + input.slice(1);
}

export async function runEval(
    client: HumanloopClient,
    file: File,
    dataset: Dataset,
    name?: string,
    evaluators: Evaluator[] = [],
    concurrency: number = 8,
): Promise<EvaluatorCheck[]> {
    if (concurrency > 32) {
        console.log("Warning: Too many parallel workers, capping the number to 32.");
    }
    concurrency = Math.min(concurrency, 32);

    const file_ = checkIfCallableIsHLDecorator(file);

    let type_: FileType;
    let type_specified_: boolean;
    if (file_.type) {
        type_specified_ = true;
        type_ = file_.type;
        console.info(
            `${CYAN}Evaluating your ${capitalizeFirstLetter(type_)} File corresponding to ${file_.path} on Humanloop.${RESET}\n`,
        );
    } else {
        type_specified_ = false;
        type_ = "flow";
        console.warn(`${CYAN}No file type specified, defaulting to flow.${RESET}\n`);
    }

    const function_ = file_.callable;
    if (!function_) {
        if (!type_specified_) {
            console.error(
                `${RED}Assuming the evaluated File is a Flow because \`file.type\` was not provided. ` +
                    "Please provide a `file.callable` argument or specify `file.type` if you intend " +
                    `to evaluate a File on the Humanloop runtime.\nYou passed the \`file\` as: ${JSON.stringify(file_, null, 2)}.${RESET}\n`,
            );
            return [];
        }
        if (type_ === "flow") {
            console.error(
                `${RED}Flows cannot be evaluated on the Humanloop platform. Pass ` +
                    `\`file.callable\` to run a local eval.${RESET}\n`,
            );
            return [];
        } else {
            console.info(
                `${CYAN}No callable provided for your ${capitalizeFirstLetter(type_)} file - will attempt to generate logs on Humanloop.${RESET}\n`,
            );
        }
    }

    let { callable, version, ...rest } = file_;
    version = version || {};
    let hlFile: FileResponse;
    // Check if File exists on Humanloop and is of the correct type
    const path = file_.path;
    switch (type_) {
        case "flow": {
            try {
                // Be more lenient with Flow versions as they are arbitrary json
                if (version && !version.attributes) {
                    version.attributes = { ...version } as Record<string, unknown>;
                }
                const updatedData = { ...rest, ...version } as FlowRequest;
                hlFile = await client.flows.upsert(updatedData);
            } catch (e) {
                console.error(
                    `${RED}Error upserting the evaluated Flow. Check the \`file.version\` argument. ` +
                        `Is there an existing File of different type at path ${path}?${RESET}`,
                );
                return [];
            }
            break;
        }
        case "prompt": {
            try {
                hlFile = await client.prompts.upsert({
                    ...rest,
                    ...version,
                } as PromptRequest);
            } catch (e) {
                console.error(
                    `${RED}Error upserting the evaluated Prompt. Check the \`file.version\` argument. ` +
                        `Is there an existing File of different type at path ${path}?${RESET}`,
                );
                return [];
            }
            break;
        }
        case "tool": {
            try {
                hlFile = await client.tools.upsert({
                    ...rest,
                    ...version,
                } as ToolRequest);
            } catch (e) {
                console.error(
                    `${RED}Error upserting the evaluated Tool. Check the \`file.version\` argument. ` +
                        `Is there an existing File of different type at path ${path}?${RESET}`,
                );
                return [];
            }
            break;
        }
        case "evaluator": {
            try {
                // @ts-ignore EvaluatorRequest is generated by Fern as 'unknown'
                // Leading to a type error here
                hlFile = await client.evaluators.upsert({
                    ...rest,
                    ...version,
                } as EvaluatorsRequest);
            } catch (e) {
                console.error(
                    `${RED}Error upserting the evaluated Evaluator. Check the \`file.version\` argument. ` +
                        `Is there an existing File of different type at path ${path}?${RESET}`,
                );
                return [];
            }
            break;
        }
        default:
            console.error(`${RED}Unsupported File type: ${type_}.${RESET}`);
            return [];
    }

    let hlDataset: DatasetResponse | undefined;
    // Upsert the dataset
    if (!("path" in dataset)) {
        console.error(
            `${RED}You must provide a path in your \`dataset\` argument.${RESET}`,
        );
        return [];
    }
    // User references an online dataset
    if (!("datapoints" in dataset)) {
        // User references an online dataset
        const path_ = dataset.path!;
        const name = path_.includes("/") ? path_.split("/").pop() : path_;
        // We can't get dataset by path, so we query all datasets and filter by name
        const files = await client.files.listFiles({
            type: "dataset",
            name: name,
        });
        const matchingDatasets = files.records.filter((file) => file.path === path_);
        if (matchingDatasets.length === 0) {
            console.error(
                `${RED}Dataset with path ${path_} not found. ` +
                    `If you meant to provide a local dataset, ` +
                    `pass them in \`dataset.datapoints\` arguments directly.${RESET}`,
            );
            return [];
        }
        if (matchingDatasets.length > 1) {
            console.error(
                `${RED}Multiple datasets match the provided path. ` +
                    `Have you provided the full path to the Dataset?${RESET}`,
            );
            return [];
        }
        const datasetId = matchingDatasets[0].id;
        hlDataset = (await client.datasets.get(datasetId, {
            includeDatapoints: true,
        })) as DatasetResponse;
    } else {
        if (dataset.action === undefined) {
            dataset.action = "set";
        }
        if (!dataset.datapoints) {
            console.error(
                `${RED}Argument \`dataset.datapoints\` should have type DatapointRequest[] objects.${RESET}`,
            );
            return [];
        }
        hlDataset = await client.datasets.upsert({
            ...dataset,
            // Doing a type cast to satisfy the type checker
            datapoints: dataset.datapoints!,
        });
        hlDataset = await client.datasets.get(hlDataset.id, {
            versionId: hlDataset.versionId,
            includeDatapoints: true,
        });
    }

    // Upsert the local Evaluators; other Evaluators are just referenced by `path` or `id`
    let localEvaluators: [EvaluatorResponse, Function][] = [];
    if (evaluators) {
        const evaluatorsWithCallable = evaluators.filter(
            (e) => e.callable !== undefined,
        );

        if (evaluatorsWithCallable.length > 0 && function_ == null) {
            console.error(
                `${RED}Local Evaluators are only supported when generating Logs locally using your ${capitalizeFirstLetter(type_)}'s 'callable'. ` +
                    `Please provide a \`file.callable\` for your File in order to run Evaluators locally.${RESET}`,
            );
            return [];
        }

        const upsertEvaluatorsPromises = evaluatorsWithCallable.map(
            async (evaluator) => {
                if (
                    evaluator.argsType === undefined ||
                    evaluator.returnType === undefined
                ) {
                    throw new Error(
                        `You must provide 'argsType', 'returnType' and for your local Evaluator: ${evaluator.path}`,
                    );
                }
                const spec: ExternalEvaluatorRequest = {
                    argumentsType: evaluator.argsType,
                    returnType: evaluator.returnType,
                    attributes: { code: evaluator.callable!.toString() },
                    evaluatorType: "external",
                };
                const evaluatorResponse = await client.evaluators.upsert({
                    id: evaluator.id,
                    path: evaluator.path,
                    spec,
                });
                localEvaluators.push([evaluatorResponse, evaluator.callable!]);
            },
        );

        await Promise.all(upsertEvaluatorsPromises);
    }

    // Validate upfront that the local Evaluators and Dataset fit
    const requiresTarget = localEvaluators.find(
        ([evaluator, _]) => evaluator.spec.argumentsType === "target_required",
    );

    if (requiresTarget) {
        if (!hlDataset.datapoints) {
            throw new Error("Datapoints are undefined.");
        }
        const missingTargets = hlDataset.datapoints.filter(
            (datapoint) => !datapoint.target,
        ).length;

        if (missingTargets > 0) {
            localEvaluators.forEach(([evaluator, _]) => {
                if (evaluator.spec.argumentsType === "target_required") {
                    throw new Error(
                        `${missingTargets} Datapoints have no target. A target is required for the Evaluator: ${evaluator.path}`,
                    );
                }
            });
        }
    }

    // Get or create the Evaluation based on the name
    let evaluation = null;
    try {
        evaluation = await client.evaluations.create({
            name,
            evaluators: evaluators.map(
                (evaluator) => ({ path: evaluator.path }) as { path: string },
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
                if (e.name === name) {
                    evaluation = e;
                    break;
                }
            }
        }
        if (!evaluation) {
            throw new Error(
                `Internal Error: Evaluation with name ${name} not found, but creating it has failed.`,
            );
        }
    }

    // Create a new Run
    const run = await client.evaluations.createRun(evaluation.id, {
        dataset: { versionId: hlDataset.versionId },
        version: { versionId: hlFile.versionId },
        orchestrated: function_ ? false : true,
        useExistingLogs: false,
    });
    const runId = run.id;

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
        contextApi.context.with(
            setEvaluationContext(
                new EvaluationContext({
                    sourceDatapointId: datapoint.id,
                    runId,
                    callback: uploadCallback,
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
                try {
                    const evaluationContext = getEvaluationContext();
                    const funcOutput = await function_!(funcInputs);
                    const logOutput = jsonifyIfNotString(function_!, funcOutput);
                    if (!callableIsHumanloopUtility(file_)) {
                        // callable is a plain function, so we create the log here
                        const log = (await logFunc({
                            inputs: { ...datapoint.inputs },
                            messages: datapoint.messages,
                            output: logOutput,
                            sourceDatapointId: datapoint.id,
                            runId: runId,
                            startTime: startTime,
                            endTime: new Date(),
                        })) as LogResponse;
                        evaluationContext!.logging_counter += 1;
                        await uploadCallback(log.id);
                    } else {
                        if (evaluationContext!.logging_counter === 0) {
                            throw new Error(
                                `Passed callable did not produce Logs against File ${
                                    hlFile.path
                                }. Are you logging against it or make any LLM provider calls inside the 
                                Prompt-decorated function?`,
                            );
                        }
                    }
                } catch (e) {
                    const errorMessage = e instanceof Error ? e.message : String(e);
                    await logFunc({
                        inputs: { ...datapoint.inputs },
                        messages: datapoint.messages,
                        error: errorMessage,
                        sourceDatapointId: datapoint.id,
                        runId: runId,
                        startTime: startTime,
                        endTime: new Date(),
                    });
                    console.warn(
                        `\nYour ${type_}'s callable failed for Datapoint: ${datapoint.id}.\nError: ${errorMessage}`,
                    );
                }
            },
        );
    }

    console.log(`\n${CYAN}Navigate to your Evaluation:${RESET}\n${evaluation.url}\n`);
    console.log(
        `${CYAN}${type_.charAt(0).toUpperCase() + type_.slice(1)} Version ID: ${
            hlFile.versionId
        }${RESET}`,
    );
    console.log(`${CYAN}Run ID: ${runId}${RESET}`);

    // Generate locally if a function is provided
    if (function_) {
        console.log(
            `${CYAN}\nRunning ${hlFile.name} over the Dataset ${hlDataset.name}${RESET}`,
        );
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
    } else {
        // TODO: trigger run when updated API is available
        console.log(
            `${CYAN}\nRunning ${hlFile.name} over the Dataset ${hlDataset.name}${RESET}`,
        );
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
    localEvaluators: [EvaluatorResponse, Function][],
) {
    const log = await client.logs.get(logId);

    const promises = localEvaluators.map(async ([evaluator, evalFunction]) => {
        const startTime = new Date();
        let judgment: any | undefined;
        try {
            if (evaluator.spec.argumentsType === "target_required") {
                judgment = await evalFunction(log, datapoint);
            } else {
                judgment = await evalFunction(log);
            }

            // @ts-ignore Using the original method instead of the overloaded one
            await client.evaluators._log({
                path: evaluator.path,
                versionId: evaluator.versionId,
                parentId: logId,
                judgment: judgment,
                startTime: startTime,
                endTime: new Date(),
            });
        } catch (e) {
            // @ts-ignore Using the original method instead of the overloaded one
            await client.evaluators._log({
                path: evaluator.path,
                versionId: evaluator.versionId,
                parentId: logId,
                error: e instanceof Error ? e.message : String(e),
                startTime: startTime,
                endTime: new Date(),
            });
            console.warn(`\nEvaluator ${evaluator.path} failed with error ${e}`);
        }
    });

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
