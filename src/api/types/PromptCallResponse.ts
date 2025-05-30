/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

/**
 * Response model for a Prompt call with potentially multiple log samples.
 */
export interface PromptCallResponse {
    /** When the logged event started. */
    startTime?: Date;
    /** When the logged event ended. */
    endTime?: Date;
    /** The messages passed to the to provider chat endpoint. */
    messages?: Humanloop.ChatMessage[];
    /**
     * Controls how the model uses tools. The following options are supported:
     * - `'none'` means the model will not call any tool and instead generates a message; this is the default when no tools are provided as part of the Prompt.
     * - `'auto'` means the model can decide to call one or more of the provided tools; this is the default when tools are provided as part of the Prompt.
     * - `'required'` means the model must call one or more of the provided tools.
     * - `{'type': 'function', 'function': {name': <TOOL_NAME>}}` forces the model to use the named function.
     */
    toolChoice?: Humanloop.PromptCallResponseToolChoice;
    /** Prompt used to generate the Log. */
    prompt: Humanloop.PromptResponse;
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
    /** End-user ID related to the Log. */
    user?: string;
    /** The name of the Environment the Log is associated to. */
    environment?: string;
    /** Whether the request/response payloads will be stored on Humanloop. */
    save?: boolean;
    /** This will identify a Log. If you don't provide a Log ID, Humanloop will generate one for you. */
    logId?: string;
    /** ID of the log. */
    id: string;
    /** ID of the Trace containing the Prompt Call Log. */
    traceId?: string;
    /** The logs generated by the Prompt call. */
    logs: Humanloop.PromptCallLogResponse[];
}
