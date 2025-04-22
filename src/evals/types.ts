import {
    CodeEvaluatorRequest,
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
import {
    ChatMessage,
    DatapointResponse,
    FlowLogResponse,
    PromptLogResponse,
} from "../api/types";

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

interface Identifiers {
    id?: string;
    path?: string;
}

export interface File<I extends Record<string, unknown> & { messages?: any[] }, O>
    extends Identifiers {
    /** The type of File this callable relates to on Humanloop. */
    type?: "flow" | "prompt";
    /** The contents uniquely define the version of the File on Humanloop. */
    version?: Version;
    /**
     * The function being evaluated.
     * It will be called using your Dataset inputs as follows:
     * `output = callable(datapoint.inputs)`.
     * If messages are defined in your Dataset, then
     * `output = callable(datapoint.inputs, messages=datapoint.messages)`.
     */
    callable?: (args: I) => O;
}

export interface Dataset extends Identifiers {
    /** The datapoints to map your function over to produce the outputs required by the evaluation. */
    datapoints?: DatapointRequest[];
    /**
     * How to update the Dataset given the provided Datapoints;
     * `set` replaces the existing Datapoints and `add` appends to the existing Datapoints.
     */
    action?: UpdateDatasetAction;
}

export interface Evaluator extends Identifiers {
    /**The threshold to check the Evaluator against. If the aggregate value of the Evaluator is below this threshold, the check will fail.*/
    threshold?: number;
}

/**
 * Subtype of EvaluatorReturnTypeEnum without return types used by Human Evaluators.
 */
export type LocalEvaluatorReturnTypeEnum = Omit<
    EvaluatorReturnTypeEnum,
    "select" | "multi_select"
>;

export interface OnlineEvaluator extends Evaluator {}

export interface LocalEvaluator<ReturnType, ArgsType> extends Evaluator {
    /** The type of return value the Evaluator produces */
    returnType: ReturnType;
    /** The type of arguments the Evaluator expects. */
    argsType: ArgsType;
    /** The function to run on the logs to produce the judgment. */
    callable: (
        inputs: {
            log: PromptLogResponse | FlowLogResponse;
        } & (ArgsType extends "target_required"
            ? { datapoint: DatapointResponse }
            : {}),
    ) => ReturnType extends "boolean"
        ? boolean
        : ReturnType extends "number"
          ? number
          : ReturnType extends "text"
            ? string
            : never;
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
