/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

/**
 * General request for creating a Log
 */
export interface PromptLogResponse {
    /** The message returned by the provider. */
    outputMessage?: Humanloop.ChatMessage;
    /** Number of tokens in the prompt used to generate the output. */
    promptTokens?: number;
    /** Number of reasoning tokens used to generate the output. */
    reasoningTokens?: number;
    /** Number of tokens in the output generated by the model. */
    outputTokens?: number;
    /** Cost in dollars associated to the tokens in the prompt. */
    promptCost?: number;
    /** Cost in dollars associated to the tokens in the output. */
    outputCost?: number;
    /** Reason the generation finished. */
    finishReason?: string;
    /** The messages passed to the to provider chat endpoint. */
    messages?: Humanloop.ChatMessage[];
    /**
     * Controls how the model uses tools. The following options are supported:
     * - `'none'` means the model will not call any tool and instead generates a message; this is the default when no tools are provided as part of the Prompt.
     * - `'auto'` means the model can decide to call one or more of the provided tools; this is the default when tools are provided as part of the Prompt.
     * - `'required'` means the model can decide to call one or more of the provided tools.
     * - `{'type': 'function', 'function': {name': <TOOL_NAME>}}` forces the model to use the named function.
     */
    toolChoice?: Humanloop.PromptLogResponseToolChoice;
    /** Prompt used to generate the Log. */
    prompt: Humanloop.PromptResponse;
    /** When the logged event started. */
    startTime?: Date;
    /** When the logged event ended. */
    endTime?: Date;
    /** Generated output from your model for the provided inputs. Can be `None` if logging an error, or if creating a parent Log with the intention to populate it later. */
    output?: string;
    /** User defined timestamp for when the log was created. */
    createdAt?: Date;
    /** Error message if the log is an error. */
    error?: string;
    /** Duration of the logged event in seconds. */
    providerLatency?: number;
    /** Captured log and debug statements. */
    stdout?: string;
    /** Raw request sent to provider. */
    providerRequest?: Record<string, unknown>;
    /** Raw response received the provider. */
    providerResponse?: Record<string, unknown>;
    /** The inputs passed to the prompt template. */
    inputs?: Record<string, unknown>;
    /** Identifies where the model was called from. */
    source?: string;
    /** Any additional metadata to record. */
    metadata?: Record<string, unknown>;
    /** Unique identifier for the Datapoint that this Log is derived from. This can be used by Humanloop to associate Logs to Evaluations. If provided, Humanloop will automatically associate this Log to Evaluations that require a Log for this Datapoint-Version pair. */
    sourceDatapointId?: string;
    /** The ID of the parent Log to nest this Log under in a Trace. */
    traceParentId?: string;
    /** Array of Batch IDs that this Log is part of. Batches are used to group Logs together for offline Evaluations */
    batches?: string[];
    /** End-user ID related to the Log. */
    user?: string;
    /** The name of the Environment the Log is associated to. */
    environment?: string;
    /** Whether the request/response payloads will be stored on Humanloop. */
    save?: boolean;
    /** This will identify a Log. If you don't provide a Log ID, Humanloop will generate one for you. */
    logId?: string;
    /** Unique identifier for the Log. */
    id: string;
    /** List of Evaluator Logs associated with the Log. These contain Evaluator judgments on the Log. */
    evaluatorLogs: Humanloop.EvaluatorLogResponse[];
    /** Identifier for the Flow that the Trace belongs to. */
    traceFlowId?: string;
    /** Identifier for the Trace that the Log belongs to. */
    traceId?: string;
    /** Logs nested under this Log in the Trace. */
    traceChildren?: Humanloop.LogResponse[];
}
