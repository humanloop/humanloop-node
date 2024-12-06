/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

/**
 * General request for creating a Log
 */
export interface FlowLogResponse {
    /** List of chat messages that were used as an input to the Flow. */
    messages?: Humanloop.ChatMessage[];
    /** The output message returned by this Flow. */
    outputMessage?: Humanloop.ChatMessage;
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
    /** The inputs passed to the Flow Log. */
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
    /** Flow used to generate the Log. */
    flow: Humanloop.FlowResponse;
    /** Status of the Trace. When a Trace is marked as `complete`, no more Logs can be added to it. Monitoring Evaluators will only run on completed Traces. */
    traceStatus?: Humanloop.TraceStatus;
}
