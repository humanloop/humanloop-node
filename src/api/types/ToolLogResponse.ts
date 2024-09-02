/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

/**
 * General request for creating a Log
 */
export interface ToolLogResponse {
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
    /** Unique identifier for the Session to associate the Log to. Allows you to record multiple Logs to a Session (using an ID kept by your internal systems) by passing the same `session_id` in subsequent log requests. */
    sessionId?: string;
    /** Unique identifier for the parent Log in a Session. Should only be provided if `session_id` is provided. If provided, the Log will be nested under the parent Log within the Session. */
    parentId?: string;
    /** Unique identifier for the Datapoint that this Log is derived from. This can be used by Humanloop to associate Logs to Evaluations. If provided, Humanloop will automatically associate this Log to Evaluations that require a Log for this Datapoint-Version pair. */
    sourceDatapointId?: string;
    /** Array of Batch Ids that this log is part of. Batches are used to group Logs together for offline Evaluations */
    batches?: string[];
    /** End-user ID related to the Log. */
    user?: string;
    /** The name of the Environment the Log is associated to. */
    environment?: string;
    /** Whether the request/response payloads will be stored on Humanloop. */
    save?: boolean;
    /** Unique identifier for the Log. */
    id: string;
    /** List of Evaluator Logs associated with the Log. These contain Evaluator judgments on the Log. */
    evaluatorLogs: Humanloop.EvaluatorLogResponse[];
    /** Tool details used to generate the Log. */
    tool: Humanloop.ToolResponse;
}
