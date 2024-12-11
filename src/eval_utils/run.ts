/**
 * Evaluation utils for the Humanloop SDK.
 *
 * This module provides a set of utilities to aid running Eval workflows on Humanloop
 * where you are managing the runtime of your application in your code.
 *
 * Functions in this module should be accessed via the Humanloop client. They should
 * not be called directly.
 */

import {
    CodeEvaluatorRequest,
    CreateEvaluatorLogRequest,
    CreateEvaluatorLogResponse,
    CreateFlowLogResponse,
    CreatePromptLogResponse,
    CreateToolLogResponse,
    DatapointResponse,
    EvaluatorResponse,
    EvaluatorsRequest,
    ExternalEvaluatorRequest,
    FileType,
    FlowKernelRequest,
    FlowLogRequest,
    FlowRequest,
    FlowResponse,
    HumanEvaluatorRequest,
    LlmEvaluatorRequest,
    PromptKernelRequest,
    PromptLogRequest,
    PromptRequest,
    PromptResponse,
    ToolKernelRequest,
    ToolLogRequest,
    ToolRequest,
    ToolResponse,
} from "api";
import cliProgress from "cli-progress";
import { HumanloopClient as BaseHumanloopClient } from "Client";
import pMap from "p-map";
import { Dataset, Evaluator, EvaluatorCheck, File } from "./types";

// ANSI escape codes for logging colors
const YELLOW = "\x1b[93m";
const CYAN = "\x1b[96m";
const GREEN = "\x1b[92m";
const RED = "\x1b[91m";
const RESET = "\x1b[0m";

type EvaluatorVersion =
    | LlmEvaluatorRequest
    | HumanEvaluatorRequest
    | CodeEvaluatorRequest
    | ExternalEvaluatorRequest;
type Version =
    | FlowKernelRequest
    | PromptKernelRequest
    | ToolKernelRequest
    | EvaluatorVersion;
type FileRequest =
    | FlowRequest
    | PromptRequest
    | ToolRequest
    | EvaluatorsRequest;
type FileResponse =
    | FlowResponse
    | PromptResponse
    | ToolResponse
    | EvaluatorResponse;
type LogResponse =
    | CreateFlowLogResponse
    | CreatePromptLogResponse
    | CreateToolLogResponse
    | CreateEvaluatorLogResponse;
type LogRequest =
    | FlowLogRequest
    | PromptLogRequest
    | ToolLogRequest
    | CreateEvaluatorLogRequest;

export async function runEval(
    client: BaseHumanloopClient,
    file: File,
    dataset: Dataset,
    name?: string,
    evaluators: Evaluator[] = [],
    workers: number = 4
): Promise<EvaluatorCheck[]> {
    // Get or create the file on Humanloop
    if (!file.path && !file.id) {
        throw new Error("You must provide a path or id in your `file`.");
    }

    let type: FileType;
    if (file.type) {
        type = file.type;
        console.info(
            `${CYAN}Evaluating your ${type} function corresponding to ${file.path} on Humanloop${RESET}\n\n`
        );
    } else {
        type = "flow";
        console.warn("No file type specified, defaulting to flow.");
    }

    const function_ = file.callable;
    if (!function_) {
        if (type === "flow") {
            throw new Error(
                "You must provide a callable for your Flow file to run a local eval."
            );
        } else {
            console.info(
                `No callable provided for your ${type} file - will attempt to generate logs on Humanloop.`
            );
        }
    }

    const { callable, version, ...rest } = file;
    let hlFile: FileResponse;
    switch (type) {
        case "flow": {
            // Be more lenient with Flow versions as they are arbitrary json
            if (version && !version.attributes) {
                version.attributes = version as Record<string, unknown>;
            }
            const updatedData = { ...rest, ...version } as FlowRequest;
            hlFile = await client.flows.upsert(updatedData);
        }
        case "prompt": {
            hlFile = await client.prompts.upsert({
                ...rest,
                ...version,
            } as PromptRequest);
            break;
        }
        case "tool": {
            hlFile = await client.tools.upsert({
                ...rest,
                ...version,
            } as ToolRequest);
            break;
        }
        case "evaluator": {
            hlFile = await client.evaluators.upsert({
                ...rest,
                ...version,
            } as EvaluatorsRequest);
            break;
        }
        default:
            throw new Error(`Unsupported File type: ${type}`);
    }

    // Upsert the dataset
    if (dataset.action === undefined) {
        dataset.action = "set";
    }
    if (dataset.datapoints === undefined) {
        //  Use `upsert` to get existing dataset ID if no datapoints provided, given we can't `get` on path.
        dataset.datapoints = [];
        dataset.action = "set";
    }
    let hlDataset = await client.datasets.upsert(dataset);
    hlDataset = await client.datasets.get(hlDataset.id, {
        versionId: hlDataset.versionId,
        includeDatapoints: true,
    });

    // Upsert the local Evaluators; other Evaluators are just referenced by `path` or `id`
    let localEvaluators: Evaluator[] = [];
    if (evaluators) {
        const evaluatorsWithCallable = evaluators.filter(
            (e) => e.callable != null
        );

        if (evaluatorsWithCallable.length > 0 && function_ == null) {
            throw new Error(
                `Local Evaluators are only supported when generating Logs locally using your ${type}'s 'callable'. Please provide a 'callable' for your file in order to run Evaluators locally.`
            );
        }

        const upsertEvaluatorsPromises = evaluatorsWithCallable.map(
            async (evaluator) => {
                localEvaluators.push(evaluator);
                if (
                    evaluator.argsType === undefined ||
                    evaluator.returnType === undefined
                ) {
                    throw new Error(
                        `You must provide 'argsType', 'returnType' and for your local Evaluator: ${evaluator.path}`
                    );
                }
                const spec: ExternalEvaluatorRequest = {
                    argumentsType: evaluator.argsType,
                    returnType: evaluator.returnType,
                    attributes: { code: evaluator.callable!.toString() },
                    evaluatorType: "external",
                };
                await client.evaluators.upsert({
                    id: evaluator.id,
                    path: evaluator.path,
                    spec,
                });
            }
        );

        await Promise.all(upsertEvaluatorsPromises);
    }

    // Validate upfront that the local Evaluators and Dataset fit
    const requiresTarget = localEvaluators.find(
        (evaluator) => evaluator.argsType === "target_required"
    );

    if (requiresTarget) {
        if (!hlDataset.datapoints) {
            throw new Error("Datapoints are undefined.");
        }
        const missingTargets = hlDataset.datapoints.filter(
            (datapoint) => !datapoint.target
        ).length;

        if (missingTargets > 0) {
            localEvaluators.forEach((evaluator) => {
                if (evaluator.argsType === "target_required") {
                    throw new Error(
                        `${missingTargets} Datapoints have no target. A target is required for the Evaluator: ${evaluator.path}`
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
                (evaluator) => ({ path: evaluator.path } as { path: string })
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
            throw new Error(`Evaluation with name ${name} not found.`);
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

    const progressBar = new cliProgress.SingleBar(
        {
            format:
                "Progress |" +
                "{bar}" +
                "| {percentage}% || {value}/{total} Datapoints",
        },
        cliProgress.Presets.shades_classic
    );

    const logFunc = getLogFunction(
        client,
        type,
        hlFile.id,
        hlFile.versionId,
        runId
    );

    function processDatapoint(datapoint: DatapointResponse): void {
        const start_time = new Date();

        try {
            // TODO: add json deserialization logic if output is not a string
            let output: string;
            if ("messages" in datapoint) {
                output = function_!({
                    ...datapoint.inputs,
                    messages: datapoint.messages,
                });
            } else {
                output = function_!(datapoint.inputs);
            }
            if (typeof output !== "string") {
                throw new Error(
                    `Your ${type}'s callable must return a string if you do not provide a custom logger.`
                );
            }
            logFunc({
                inputs: datapoint.inputs,
                output: output,
                sourceDatapointId: datapoint.id,
                startTime: start_time,
                endTime: new Date(),
            });
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            logFunc({
                inputs: datapoint.inputs,
                error: errorMessage,
                sourceDatapointId: datapoint.id,
                startTime: start_time,
                endTime: new Date(),
            });
            console.log(
                `\nYour ${type}'s callable failed for Datapoint: ${datapoint.id}.\nError: ${errorMessage}`
            );
        }
        // TODO add external evaluator logic
    }

    const total_datapoints = hlDataset.datapoints!.length;

    console.log(
        `\n${CYAN}Navigate to your Evaluation:${RESET}\n${evaluation.url}\n`
    );
    console.log(
        `${CYAN}${type.charAt(0).toUpperCase() + type.slice(1)} Version ID: ${
            hlFile.versionId
        }${RESET}`
    );
    console.log(`${CYAN}Run ID: ${batchId}${RESET}`);

    // Generate locally if a function is provided
    if (function_) {
        console.log(
            `${CYAN}\nRunning ${hlFile.name} over the Dataset ${hlDataset.name} using ${workers} workers${RESET}`
        );
        progressBar.start(total_datapoints, 0);
        await pMap(
            hlDataset.datapoints!,
            async (datapoint: DatapointResponse) => {
                await processDatapoint(datapoint);
                progressBar.increment();
            },
            { concurrency: workers }
        );
        progressBar.stop();
    } else {
        // TODO: trigger run when updated API is available
        console.log(
            `${CYAN}\nRunning ${hlFile.name} over the Dataset ${hlDataset.name}${RESET}`
        );
    }

    // Wait for the Evaluation to complete then print the results
    let stats;
    do {
        stats = await client.evaluations.getStats(evaluation.id);
        console.log(`\r${stats.progress}`);
        if (stats.status !== "completed") {
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    } while (stats.status !== "completed");
    console.log(stats.report);

    const checks: EvaluatorCheck[] = [];
    // TODO: Move the calculation of these checks server side so they can be included
    // in the stats endpoint, so that we don't need to re-implement them over different
    // clients.
    // if (
    //     evaluators.every(evaluator => evaluator.threshold === undefined) &&
    //     stats.versionStats.length === 1
    // ) {
    //     return checks;
    // }
    // for (const evaluator of evaluators) {
    //     const { improvementCheck, score, delta } = await checkEvaluationImprovement({
    //         evaluation,
    //         stats,
    //         evaluatorPath: evaluator.path,
    //         batchId,
    //     });

    //     let thresholdCheck: boolean | undefined = undefined;
    //     const threshold = evaluator.threshold;

    //     if (threshold !== undefined) {
    //         thresholdCheck = await checkEvaluationThreshold({
    //             evaluation,
    //             stats,
    //             evaluatorPath: evaluator.path,
    //             threshold,
    //             batchId,
    //         });
    //     }

    //     checks.push({
    //         path: evaluator.path,
    //         improvementCheck,
    //         score,
    //         delta,
    //         threshold,
    //         thresholdCheck,
    //     });
    // }

    console.info(`\n${CYAN}View your Evaluation:${RESET}\n${evaluation.url}\n`);

    return checks;
}

function getLogFunction(
    client: BaseHumanloopClient,
    type: FileType,
    fileId: string,
    versionId: string,
    runId: string
): (args: LogRequest) => Promise<LogResponse> {
    /** Returns the appropriate log function pre-filled with common parameters. */
    const logRequest = {
        // TODO: why does the Log `id` field refer to the file ID in the API?
        // Why are both `id` and `version_id` needed in the API?
        id: fileId,
        versionId: versionId,
        runId: runId,
    };

    switch (type) {
        case "flow":
            return (args: FlowLogRequest) =>
                client.flows.log({
                    ...logRequest,
                    traceStatus: "complete",
                    ...args,
                });
        case "prompt":
            return (args: PromptLogRequest) =>
                client.prompts.log({ ...logRequest, ...args });
        case "evaluator":
            // @ts-ignore
            return (args: CreateEvaluatorLogRequest) =>
                client.evaluators.log({ ...logRequest, ...args });
        case "tool":
            return (args: ToolLogRequest) =>
                client.tools.log({ ...logRequest, ...args });
        default:
            throw new Error(`Unsupported File version: ${type}`);
    }
}
