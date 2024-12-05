/**
 * Evaluation utils for the Humanloop SDK.
 *
 * This module provides a set of utilities to aid running Eval workflows on Humanloop
 * where you are managing the runtime of your application in your code.
 *
 * Functions in this module should be accessed via the Humanloop client. They should
 * not be called directly.
 */

import { HumanloopClient as BaseHumanloopClient } from "Client";
import { EvaluatorArgumentsType, FileType, EvaluatorReturnTypeEnum} from "api";
import { CreateDatapointRequest as DatapointRequest } from "api";
import { FlowRequest, PromptRequest, ToolRequest, EvaluatorsRequest} from "api";
import { FlowResponse, PromptResponse, ToolResponse, EvaluatorResponse, DatapointResponse } from "api";
import { 
    FlowKernelRequest,
    PromptKernelRequest,
    ToolKernelRequest,
    LlmEvaluatorRequest,
    HumanEvaluatorRequest,
    CodeEvaluatorRequest,
    ExternalEvaluatorRequest,
    FlowLogRequest,
    PromptLogRequest,
    ToolLogRequest,
    CreateEvaluatorLogRequest,
    CreateFlowLogResponse,
    CreatePromptLogResponse,
    CreateToolLogResponse,
    CreateEvaluatorLogResponse,
} from "api";
// TODO: fix typo in type
import { UpdateDatesetAction as UpdateDatasetAction} from "api";
import { nanoid } from 'nanoid';
import pMap from 'p-map';
import cliProgress from 'cli-progress';


// ANSI escape codes for logging colors
const YELLOW = '\x1b[93m';
const CYAN = '\x1b[96m';
const GREEN = '\x1b[92m';
const RED = '\x1b[91m';
const RESET = '\x1b[0m';

type EvaluatorVersion = LlmEvaluatorRequest | HumanEvaluatorRequest | CodeEvaluatorRequest | ExternalEvaluatorRequest;
type Version = FlowKernelRequest | PromptKernelRequest | ToolKernelRequest | EvaluatorVersion;
type FileRequest = FlowRequest | PromptRequest | ToolRequest | EvaluatorsRequest;
type FileResponse = FlowResponse | PromptResponse | ToolResponse | EvaluatorResponse;
type LogResponse = CreateFlowLogResponse | CreatePromptLogResponse | CreateToolLogResponse | CreateEvaluatorLogResponse;
type LogRequest = FlowLogRequest | PromptLogRequest | ToolLogRequest | CreateEvaluatorLogRequest;

interface Identifiers {
    id?: string;
    path?: string;
}

interface File extends Identifiers {
    /** The type of File this callable relates to on Humanloop. */
    type?: FileType;
    /** The contents uniquely define the version of the File on Humanloop. */
    version?: Version;
    /**
     * The function being evaluated.
     * It will be called using your Dataset inputs as follows:
     * `output = callable(datapoint.inputs)`.
     * If messages are defined in your Dataset, then
     * `output = callable(datapoint.inputs, messages=datapoint.messages)`.
     * It should return a single string output. If not, you must provide a custom_logger.
    */
    callable?: (...args: any[]) => string;
}

interface Dataset extends Identifiers {
    /** The datapoints to map your function over to produce the outputs required by the evaluation. */
    datapoints: DatapointRequest[];
    /**
     * How to update the Dataset given the provided Datapoints;
     * `set` replaces the existing Datapoints and `add` appends to the existing Datapoints.
    */
    action?: UpdateDatasetAction;
}


interface Evaluator extends Identifiers {
    /** The type of arguments the Evaluator expects - only required for local Evaluators. */
    argsType?: EvaluatorArgumentsType;
    /** The type of return value the Evaluator produces - only required for local Evaluators. */
    returnType?: EvaluatorReturnTypeEnum;
    /** The function to run on the logs to produce the judgment - only required for local Evaluators. */
    callable?: (...args: any[]) => any; // TODO define explicitly the args and return type
    /**
     * Optional function that logs the output judgment from your Evaluator to Humanloop.
     * If provided, it will be called as follows:
     *
     * ```typescript
     * judgment = callable(log);
     * log = custom_logger(client, judgment);
     * ```
     *
     * Inside the custom_logger, you can use the Humanloop client to log the judgment to Humanloop.
     * If not provided, your function must return a single string, and by default, the code will be used to inform the version of the external Evaluator on Humanloop.
    */
    /**The threshold to check the Evaluator against. If the aggregate value of the Evaluator is below this threshold, the check will fail.*/
    threshold?: number;
}


/**
 * Evaluate your function for a given `Dataset` and set of `Evaluators`.
 *
 * @param client - The Humanloop API client.
 * @param file - The Humanloop file being evaluated, including a function to run over the dataset.
 * @param dataset - The dataset to map your function over to produce the outputs required by the Evaluation.
 * @param name - The name of the Evaluation to run. If it does not exist, a new Evaluation will be created under your File.
 * @param evaluators - Define how judgments are provided for this Evaluation.
 * @param workers - The number of threads to process datapoints using your function concurrently.
 * @returns Per Evaluator checks.
 */
interface EvaluatorCheck {
    path: string;
    improvementCheck: boolean;
    score: number;
    delta: number;
    threshold?: number;
    thresholdCheck?: boolean;
}

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
      console.info(`${CYAN}Evaluating your ${type} function corresponding to ${file.path} on Humanloop${RESET}\n\n`);
    } else {
      type = 'flow';
      console.warn('No file type specified, defaulting to flow.');
    }

    const function_ = file.callable;
    if (!function_) {
        if (type === 'flow') {
        throw new Error('You must provide a callable for your Flow file to run a local eval.');
        } else {
        console.info(`No callable provided for your ${type} file - will attempt to generate logs on Humanloop.`);
        }
    }

    const {callable, version, ...rest } = file;
    let hlFile: FileResponse;
    switch (type) {
        case 'flow': {
        // Be more lenient with Flow versions as they are arbitrary json
        if (version && !version.attributes) {
            version.attributes = version as Record<string, unknown>;
        }
        const updatedData = {...rest, ...version} as FlowRequest;
        hlFile = await client.flows.upsert(updatedData);
        }
        case 'prompt': {;
            hlFile = await client.prompts.upsert({...rest, ...version} as PromptRequest);
            break;
        }
        case 'tool': {
            hlFile = await client.tools.upsert({...rest, ...version}  as ToolRequest);
            break;
        }
        case 'evaluator': {
            hlFile = await client.evaluators.upsert({...rest, ...version}  as EvaluatorsRequest);
            break;
        }
        default:
            throw new Error(`Unsupported File type: ${type}`);
    };

    // TODO: Update action logic: https://github.com/humanloop/humanloop-python/blob/a6fde1abf8a5be529cf27b6c0824886c7370f8d1/src/humanloop/eval_utils/run.py#L328
    let hlDataset = await client.datasets.upsert(dataset);
    hlDataset = await client.datasets.get(hlDataset.id, {includeDatapoints: true });

    // Upsert the local Evaluators; other Evaluators are just referenced by `path` or `id`
    let localEvaluators: Evaluator[] = [];

    if (evaluators) {
        const evaluatorsWithCallable = evaluators.filter(e => e.callable != null);

        if (evaluatorsWithCallable.length > 0 && function_ == null) {
            throw new Error(
                `Local Evaluators are only supported when generating Logs locally using your ${type}'s 'callable'. Please provide a 'callable' for your file in order to run Evaluators locally.`
            );
        }

        const upsertEvaluatorsPromises = evaluatorsWithCallable.map(async evaluator => {
            localEvaluators.push(evaluator);
            if (evaluator.argsType === undefined || evaluator.returnType === undefined) {
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
            await client.evaluators.upsert({ id: evaluator.id, path: evaluator.path, spec });
        });

        await Promise.all(upsertEvaluatorsPromises);
    }

    // Validate upfront that the local Evaluators and Dataset fit
    const targetEvaluator = localEvaluators.find(evaluator => evaluator.argsType === "target_required");

    if (targetEvaluator) {
        if (!hlDataset.datapoints) {
            throw new Error('Datapoints are undefined.');
        }
        const missingTargets = hlDataset.datapoints.filter(datapoint => !datapoint.target).length;

        if (missingTargets > 0) {
            throw new Error(
                `${missingTargets} Datapoints have no target. A target is required for the Evaluator: ${targetEvaluator.path}`
            );
        }
    }

    // Get or create the Evaluation based on the name
    let evaluation = null;
    try {
        evaluation = await client.evaluations.create({
            name,
            dataset: { fileId: hlDataset.id },
            evaluators: evaluators.map(evaluator => ({ path: evaluator.path })),
            file: { id: hlFile.id },
        });
    } catch (error: any) {
        // If the name exists, go and get it
        // TODO: Update API GET to allow querying by name and file.
        if (error.statusCode === 409) {
            const evals = await client.evaluations.list({ fileId: hlFile.id, size: 50 });
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

    const batchId = nanoid();
    const logFunc = getLogFunc(client, type, hlFile.id, hlFile.versionId, evaluation.id, batchId);

    function processDatapoint(datapoint: DatapointResponse): void {
        const start_time = new Date();
    
        try {
            // TODO: add json deserialization logic if output is not a string
            let output: string;
            if ('messages' in datapoint) {
                output = function_!({ ...datapoint.inputs, messages: datapoint.messages });
            } else {
                output = function_!(datapoint.inputs);
            }
            if (typeof output !== 'string') {
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
    const progressBar = new cliProgress.SingleBar(
        {
            format: 'Progress |' + '{bar}' + '| {percentage}% || {value}/{total} Datapoints',
        },
        cliProgress.Presets.shades_classic
    );

    console.log(`\n${CYAN}Navigate to your Evaluation:${RESET}\n${evaluation.url}\n`);
    console.log(`${CYAN}${type.charAt(0).toUpperCase() + type.slice(1)} Version ID: ${hlFile.versionId}${RESET}`);
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
        console.log(`${CYAN}\nRunning ${hlFile.name} over the Dataset ${hlDataset.name}${RESET}`);
    }

    // Wait for the Evaluation to complete then print the results
    let stats;
    do {
        stats = await client.evaluations.getStats(evaluation.id);
        console.log(`\r${stats.progress}`);
        if (stats.status !== 'completed') {
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    } while (stats.status !== 'completed');
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


function getLogFunc(
    client: BaseHumanloopClient,
    type: FileType,
    fileId: string,
    versionId: string,
    evaluationId: string,
    batchId: string,
    parentId?: string
  ): (args: LogRequest) => Promise<LogResponse> {
    /** Returns the appropriate log function pre-filled with common parameters. */
    const logRequest = {
      // TODO: why does the Log `id` field refer to the file ID in the API?
      // Why are both `id` and `version_id` needed in the API?
      id: fileId,
      versionId: versionId,
      evaluationId: evaluationId,
      batchId: batchId,
    };
  
    switch (type) {
      case 'flow':
        return (args: LogRequest) =>
          client.flows.log({ ...logRequest, traceStatus: 'complete', ...args });
      case 'prompt':
        return (args: LogRequest) => client.prompts.log({ ...logRequest, ...args });
      case 'evaluator':
        if (parentId === null || parentId === undefined) {
            throw new Error('parentId is required for Evaluator logs.');
        }
        const evaluatorLogRequest = {
            ...logRequest,
            parentId: parentId,
        };
        return (args: LogRequest) => client.evaluators.log({ ...evaluatorLogRequest, ...args });
      case 'tool':
        return (args: LogRequest) => client.tools.log({ ...logRequest, ...args });
      default:
        throw new Error(`Unsupported File version: ${type}`);
    }
  }

