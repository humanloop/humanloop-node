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
import { Humanloop, HumanloopClient } from "index";
import _ from "lodash";
import pMap from "p-map";

import {
    BooleanEvaluatorStatsResponse,
    CreateEvaluatorLogResponse,
    CreateFlowLogResponse,
    CreatePromptLogResponse,
    CreateToolLogResponse,
    DatapointResponse,
    EvaluationResponse,
    EvaluationStats,
    EvaluatorResponse,
    EvaluatorsRequest,
    ExternalEvaluatorRequest,
    FileType,
    FlowLogRequest,
    FlowRequest,
    NumericEvaluatorStatsResponse,
    PromptLogRequest,
    PromptRequest,
    RunStatsResponse,
    ToolLogRequest,
    ToolRequest,
} from "../api";
import { Flows } from "../api/resources/flows/client/Client";
import { Prompts } from "../api/resources/prompts/client/Client";
import { jsonifyIfNotString } from "../otel/helpers";
import { evaluationContext } from "./context";
import { Dataset, Evaluator, EvaluatorCheck, File, FileResponse } from "./types";

// ANSI escape codes for logging colors
const YELLOW = "\x1b[93m";
const CYAN = "\x1b[96m";
const GREEN = "\x1b[92m";
const RED = "\x1b[91m";
const RESET = "\x1b[0m";

type LogResponse =
    | CreateFlowLogResponse
    | CreatePromptLogResponse
    | CreateToolLogResponse
    | CreateEvaluatorLogResponse;

export function overloadLog<T extends Flows | Prompts>(client: T): T {
    const originalLog = client.log.bind(client);

    // @ts-ignore
    const _overloadedLog: T["log"] = async (
        request: FlowLogRequest | PromptLogRequest,
        options?: Flows.RequestOptions | Prompts.RequestOptions,
    ) => {
        let response: LogResponse | undefined;
        if (evaluationContext.isEvaluatedFile(request)) {
            const state = evaluationContext.getState();
            if (state === undefined) {
                throw Error(
                    "Internal Error: EvaluationContext state used without being called set before.",
                );
            }

            const { runId, sourceDatapointId, uploadCallback } =
                evaluationContext.getDatapoint({
                    inputs: request.inputs,
                    messages: request.messages,
                });

            if (request.runId === undefined) {
                request = {
                    ...request,
                    runId,
                };
            }
            if (request.sourceDatapointId === undefined) {
                request = {
                    ...request,
                    sourceDatapointId: sourceDatapointId,
                };
            }
            if (client instanceof Flows) {
                request = {
                    ...request,
                    traceStatus: "complete",
                };
            }

            if ("flow" in request) {
                if (!_.isEqual(state.evaluatedVersion, request.flow)) {
                    response = await originalLog(
                        {
                            ...request,
                            // @ts-ignore Log under the version expected by evaluation, not
                            // one determined by decorators. Otherwise the log will be found
                            // in the File's Log but not appear in the Evaluation, which can
                            // lead to confusion
                            flow: state?.evaluatedVersion,
                            output: undefined,
                            error: `The version of the evaluated Flow must match the version of the callable. Expected: ${JSON.stringify(state!.evaluatedVersion)}, got: ${JSON.stringify(request.flow)}`,
                        },
                        options,
                    );
                }
            }

            if ("prompt" in request) {
                if (!_.isEqual(state.evaluatedVersion, request.prompt)) {
                    response = await originalLog({
                        ...request,
                        // @ts-ignore Log under the version expected by evaluation, not
                        // one determined by decorators. Otherwise the evaluation will stale
                        prompt: state?.evaluatedVersion,
                        output: undefined,
                        error: `The version of the evaluated Prompt must match the version of the callable. Expected: ${JSON.stringify(state!.evaluatedVersion)}, got: ${JSON.stringify(request.prompt)}`,
                    });
                }
            }

            if (response === undefined) {
                // Version validation passed, make a normal request
                response = await originalLog(request, options);
            }

            uploadCallback(response.id);
        } else {
            // @ts-ignore
            response = await originalLog(request, options);
        }

        return response;
    };

    client.log = _overloadedLog.bind(client);

    return client;
}

export async function runEval(
    client: HumanloopClient,
    file: File,
    dataset: Dataset,
    name?: string,
    evaluators: Evaluator[] = [],
    workers: number = 8,
): Promise<EvaluatorCheck[]> {
    // Get or create the file on Humanloop
    if (!file.path && !file.id) {
        throw new Error("You must provide a path or id in your `file`.");
    }

    if (workers > 32) {
        console.log("Warning: Too many parallel workers, capping the number to 32.");
    }
    workers = Math.min(workers, 32);

    if (file.callable && "path" in file.callable) {
        if (file.path !== file.callable.path) {
            throw new Error(
                `The path of the evaluated \`file\` must match the path of your decorated \`callable\`. Expected path: ${file.path}, got: ${file.callable.path}`,
            );
        }
    }

    if (file.callable && "version" in file.callable) {
        if (!_.isEqual(file.version, file.callable.version)) {
            throw new Error(
                `The version of the evaluated \`file\` must match the version of your decorated \`callable\`. Expected version: ${JSON.stringify(file.version)}, got: ${JSON.stringify(file.callable.version)}`,
            );
        }
    }

    let type: FileType;
    if (file.type) {
        type = file.type;
        console.info(
            `${CYAN}Evaluating your ${type} function corresponding to ${file.path} on Humanloop${RESET}\n\n`,
        );
    } else {
        type = "flow";
        console.warn("No file type specified, defaulting to flow.");
    }

    const function_ = file.callable;
    if (!function_) {
        if (type === "flow") {
            throw new Error(
                "You must provide a callable for your Flow file to run a local eval.",
            );
        } else {
            console.info(
                `No callable provided for your ${type} file - will attempt to generate logs on Humanloop.`,
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
            break;
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
            // @ts-ignore EvaluatorRequest is generated by Fern as 'unknown'
            // Leading to a type error here
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
    let localEvaluators: [EvaluatorResponse, Function][] = [];
    if (evaluators) {
        const evaluatorsWithCallable = evaluators.filter((e) => e.callable !== null);

        if (evaluatorsWithCallable.length > 0 && function_ == null) {
            throw new Error(
                `Local Evaluators are only supported when generating Logs locally using your ${type}'s 'callable'. Please provide a 'callable' for your file in order to run Evaluators locally.`,
            );
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

    // Set the Evaluation context
    evaluationContext.setState({
        fileId: hlFile.id,
        path: hlFile.path,
        uploadCallback: async (logId: string, datapoint: DatapointResponse) => {
            await runLocalEvaluators(client, logId, datapoint, localEvaluators);
            progressBar.increment();
        },
        evaluatedVersion: file.version,
    });

    async function processDatapoint(
        datapoint: DatapointResponse,
        runId: string,
    ): Promise<void> {
        const start_time = new Date();
        const logFunc = getLogFunction(
            client,
            type,
            hlFile.id,
            hlFile.versionId,
            runId,
        );

        try {
            evaluationContext.addDatapoint(datapoint, runId);
            let output: string;
            if (datapoint.inputs === undefined) {
                throw new Error(`Datapoint 'inputs' attribute is undefined.`);
            }
            output = await function_!(
                // @ts-ignore
                datapoint.inputs,
                datapoint.messages,
            );

            output = jsonifyIfNotString(function_!, output);

            if (
                evaluationContext.peekDatapoint({
                    inputs: datapoint.inputs,
                    messages: datapoint.messages,
                })
            ) {
                // function_ is a simple callable, so we create the log here
                // if function_ was a utility wrapped function, the utility
                // would have created the log in otel.HumanloopSpanExporter

                // The log function will take care of the sourceDatapointId and runId from the context
                // See overloadLog in this module for more details
                await logFunc({
                    inputs: { ...datapoint.inputs },
                    messages: datapoint.messages,
                    output: output,
                    startTime: start_time,
                    endTime: new Date(),
                });
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            await logFunc({
                inputs: { ...datapoint.inputs },
                error: errorMessage,
                sourceDatapointId: datapoint.id,
                startTime: start_time,
                endTime: new Date(),
            });
            // console.log(e);
            console.warn(
                `\nYour ${type}'s callable failed for Datapoint: ${datapoint.id}.\nError: ${errorMessage}`,
            );
        }
    }

    console.log(`\n${CYAN}Navigate to your Evaluation:${RESET}\n${evaluation.url}\n`);
    console.log(
        `${CYAN}${type.charAt(0).toUpperCase() + type.slice(1)} Version ID: ${
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
            { concurrency: workers },
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
        console.log(`\r${stats.progress}`);
        if (stats.status !== "completed") {
            await new Promise((resolve) => setTimeout(resolve, 5000));
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
                await client.flows.log({
                    ...logRequest,
                    traceStatus: "complete",
                    ...args,
                });
        case "prompt":
            return async (args: PromptLogRequest) =>
                await client.prompts.log({ ...logRequest, ...args });
        // case "evaluator":
        //     return (args: CreateEvaluatorLogRequest) =>
        //         client.evaluators.log({ ...logRequest, ...args });
        case "tool":
            return async (args: ToolLogRequest) =>
                await client.tools.log({ ...logRequest, ...args });
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

            await client.evaluators.log({
                path: evaluator.path,
                versionId: evaluator.versionId,
                parentId: logId,
                judgment: judgment,
                startTime: startTime,
                endTime: new Date(),
            });
        } catch (e) {
            await client.evaluators.log({
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
