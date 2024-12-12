import {
    CodeEvaluatorRequest,
    CreateEvaluatorLogRequest,
    CreateEvaluatorLogResponse,
    CreateFlowLogResponse,
    CreatePromptLogResponse,
    CreateToolLogResponse,
    CreateDatapointRequest as DatapointRequest,
    EvaluatorArgumentsType,
    EvaluatorResponse,
    EvaluatorReturnTypeEnum,
    EvaluatorsRequest,
    ExternalEvaluatorRequest,
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
    UpdateDatesetAction as UpdateDatasetAction,
} from "api";

import { FileType } from "../api/types/FileType";

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
export type FileRequest = FlowRequest | PromptRequest | ToolRequest | EvaluatorsRequest;
export type FileResponse =
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

interface Identifiers {
    id?: string;
    path?: string;
}

export interface File extends Identifiers {
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
    callable?: (...args: any[]) => string | Promise<string>;
}

export interface Dataset extends Identifiers {
    /** The datapoints to map your function over to produce the outputs required by the evaluation. */
    datapoints: DatapointRequest[];
    /**
     * How to update the Dataset given the provided Datapoints;
     * `set` replaces the existing Datapoints and `add` appends to the existing Datapoints.
     */
    action?: UpdateDatasetAction;
}

export interface Evaluator extends Identifiers {
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
export interface EvaluatorCheck {
    path: string;
    // TODO: Add number valence and improvement check
    // improvementCheck: boolean;
    score: number;
    delta: number;
    threshold?: number;
    thresholdCheck?: boolean;
    evaluationId: string;
}
