/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

/**
 * Request for creating a Prompt log.
 */
export interface PromptLogResponse {
    /** Unique identifier for the Log. */
    id: string;
    /** The message returned by the provider. */
    outputMessage?: Humanloop.ChatMessage;
    /** Number of tokens in the prompt used to generate the output. */
    promptTokens?: number;
    /** Number of tokens in the output generated by the model. */
    outputTokens?: number;
    /** Cost in dollars associated to the tokens in the prompt. */
    promptCost?: number;
    /** Cost in dollars associated to the tokens in the output. */
    outputCost?: number;
    /** Reason the generation finished. */
    finishReason?: string;
    /** Prompt details used to generate the log. */
    prompt: Humanloop.PromptResponse;
    /** The messages passed to the to provider chat endpoint. */
    messages?: Humanloop.ChatMessage[];
    /**
     * Controls how the model uses tools. The following options are supported:
     *
     * - `'none'` means the model will not call any tool and instead generates a message; this is the default when no tools are provided as part of the Prompt.
     * - `'auto'` means the model can decide to call one or more of the provided tools; this is the default when tools are provided as part of the Prompt.
     * - `'required'` means the model can decide to call one or more of the provided tools.
     * - `{'type': 'function', 'function': {name': <TOOL_NAME>}}` forces the model to use the named function.
     */
    toolChoice?: Humanloop.PromptLogResponseToolChoice;
    /** Generated output from your model for the provided inputs. Can be `None` if logging an error, or if creating a parent Log with the intention to populate it later. */
    output?: string;
    /** Raw output from the provider. */
    rawOutput?: string;
    /** User defined timestamp for when the log was created. */
    createdAt?: Date;
    /** Error message if the log is an error. */
    error?: string;
    /** Duration of the logged event in seconds. */
    providerLatency?: number;
    /** Raw request sent to provider. */
    providerRequest?: Record<string, unknown>;
    /** Raw response received the provider. */
    providerResponse?: Record<string, unknown>;
    /** Unique identifier for the Session to associate the Log to. Allows you to record multiple Logs to a Session (using an ID kept by your internal systems) by passing the same `session_id` in subsequent log requests. */
    sessionId?: string;
    /** Unique identifier for the parent Log in a Session. Should only be provided if `session_id` is provided. If provided, the Log will be nested under the parent Log within the Session. */
    parentId?: string;
    /** The inputs passed to the prompt template. */
    inputs?: Record<string, unknown>;
    /** Identifies where the model was called from. */
    source?: string;
    /** Any additional metadata to record. */
    metadata?: Record<string, unknown>;
    /** Whether the request/response payloads will be stored on Humanloop. */
    save?: boolean;
    /** Unique identifier for the Datapoint that this Log is derived from. This can be used by Humanloop to associate Logs to Evaluations. If provided, Humanloop will automatically associate this Log to Evaluations that require a Log for this Datapoint-Version pair. */
    sourceDatapointId?: string;
    /** Array of Batch Ids that this log is part of. Batches are used to group Logs together for offline Evaluations */
    batches?: string[];
    /** End-user ID related to the Log. */
    user?: string;
    /** The name of the Environment the Log is associated to. */
    environment?: string;
}
