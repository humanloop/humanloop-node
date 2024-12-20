import {
    CodeEvaluatorRequest,
    CreateEvaluatorLogResponse,
    CreateFlowLogResponse,
    CreatePromptLogResponse,
    CreateToolLogResponse,
    CreateDatapointRequest as DatapointRequest,
    EvaluatorResponse,
    EvaluatorReturnTypeEnum,
    EvaluatorsRequest,
    ExternalEvaluatorRequest,
    FlowKernelRequest,
    FlowRequest,
    FlowResponse,
    HumanEvaluatorRequest,
    LlmEvaluatorRequest,
    PromptKernelRequest,
    PromptRequest,
    PromptResponse,
    ToolKernelRequest,
    ToolRequest,
    ToolResponse,
    UpdateDatesetAction as UpdateDatasetAction,
} from "../api";
import { DatapointResponse, EvaluatorArgumentsType } from "../api/types";
import { FileType } from "../api/types/FileType";

type EvaluatorVersion =
    | LlmEvaluatorRequest
    | HumanEvaluatorRequest
    | CodeEvaluatorRequest
    | ExternalEvaluatorRequest;
export type Version =
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
     */
    callable?:
        | ((inputs: any, messages?: any[]) => string | Promise<string>)
        // Decorated callables carry metadata about path and version
        // Which should match the ones provided in the File
        | {
              (inputs: any, messages?: any[]): string | Promise<string>;
              version: Version;
              path: string;
          };
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
    /** The type of return value the Evaluator produces - only required for local Evaluators. */
    returnType?: EvaluatorReturnTypeEnum;
    /**The threshold to check the Evaluator against. If the aggregate value of the Evaluator is below this threshold, the check will fail.*/
    threshold?: number;
    callable: Function;
    argsType: EvaluatorArgumentsType;
}

export interface TargetFreeEvaluator extends Evaluator {
    argsType: "target_free";
    callable: (log: LogResponse) => string | number | boolean;
}

export interface TargetedEvaluator extends Evaluator {
    argsType: "target_required";
    callable: (
        inputs: LogResponse,
        target: DatapointResponse,
    ) => string | number | boolean;
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
