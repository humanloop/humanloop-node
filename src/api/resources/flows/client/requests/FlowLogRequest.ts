/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../../../../index";

/**
 * @example
 *     {}
 */
export interface FlowLogRequest {
    /**
     * A specific Version ID of the Flow to log to.
     */
    versionId?: string;
    /**
     * Name of the Environment identifying a deployed version to log to.
     */
    environment?: string;
    /** Unique identifier for the Evaluation Report to associate the Log to. */
    evaluationId?: string;
    /** Path of the Flow, including the name. This locates the Flow in the Humanloop filesystem and is used as as a unique identifier. Example: `folder/name` or just `name`. */
    path?: string;
    /** ID for an existing Flow. */
    id?: string;
    /** The start time of the Trace. Will be updated if a child Log with an earlier start time is added. */
    startTime?: Date;
    /** The end time of the Trace. Will be updated if a child Log with a later end time is added. */
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
    /** ID of the Trace. If not provided, one will be assigned. */
    traceId?: string;
    /** Log under which this Log should be nested. Leave field blank if the Log should be nested directly under root Trace Log. Parent Log should already be added to the Trace. */
    traceParentLogId?: string;
    /** Array of Batch Ids that this log is part of. Batches are used to group Logs together for offline Evaluations */
    batches?: string[];
    /** End-user ID related to the Log. */
    user?: string;
    /** The name of the Environment the Log is associated to. */
    flowLogRequestEnvironment?: string;
    /** Whether the request/response payloads will be stored on Humanloop. */
    save?: boolean;
    /** Flow used to generate the Trace. */
    flow?: Humanloop.FlowKernelRequest;
    /** Status of the Trace. When a Trace is marked as `complete`, no more Logs can be added to it. Monitoring Evaluators will only run on `complete` Traces. If you do not intend to add more Logs to the Trace after creation, set this to `complete`. */
    traceStatus?: Humanloop.TraceStatus;
}
