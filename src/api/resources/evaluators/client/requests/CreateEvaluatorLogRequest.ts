/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../../../../index";

/**
 * @example
 *     {
 *         parentId: "parent_id"
 *     }
 */
export interface CreateEvaluatorLogRequest {
    /**
     * ID of the Evaluator version to log against.
     */
    versionId?: string;
    /**
     * Name of the Environment identifying a deployed version to log to.
     */
    environment?: string;
    /** Path of the Evaluator, including the name. This locates the Evaluator in the Humanloop filesystem and is used as as a unique identifier. For example: `folder/name` or just `name`. */
    path?: string;
    /** ID for an existing Evaluator. */
    id?: string;
    /** When the logged event started. */
    startTime?: Date;
    /** When the logged event ended. */
    endTime?: Date;
    /** Generated output from the LLM. Only populated for LLM Evaluator Logs. */
    output?: string;
    /** User defined timestamp for when the log was created. */
    createdAt?: Date;
    /** Error message if the log is an error. */
    error?: string;
    /** Duration of the logged event in seconds. */
    providerLatency?: number;
    /** Captured log and debug statements. */
    stdout?: string;
    /** Raw request sent to provider. Only populated for LLM Evaluator Logs. */
    providerRequest?: Record<string, unknown>;
    /** Raw response received the provider. Only populated for LLM Evaluator Logs. */
    providerResponse?: Record<string, unknown>;
    /** The inputs passed to the prompt template. */
    inputs?: Record<string, unknown>;
    /** Identifies where the model was called from. */
    source?: string;
    /** Any additional metadata to record. */
    metadata?: Record<string, unknown>;
    /** Status of a Log. Set to `incomplete` if you intend to update and eventually complete the Log and want the File's monitoring Evaluators to wait until you mark it as `complete`. If log_status is not provided, observability will pick up the Log as soon as possible. Updating this from specified to unspecified is undefined behavior. */
    logStatus?: Humanloop.LogStatus;
    /** Identifier of the evaluated Log. The newly created Log will have this one set as parent. */
    parentId: string;
    /** Unique identifier for the Datapoint that this Log is derived from. This can be used by Humanloop to associate Logs to Evaluations. If provided, Humanloop will automatically associate this Log to Evaluations that require a Log for this Datapoint-Version pair. */
    sourceDatapointId?: string;
    /** The ID of the parent Log to nest this Log under in a Trace. */
    traceParentId?: string;
    /** End-user ID related to the Log. */
    user?: string;
    /** The name of the Environment the Log is associated to. */
    createEvaluatorLogRequestEnvironment?: string;
    /** Whether the request/response payloads will be stored on Humanloop. */
    save?: boolean;
    /** This will identify a Log. If you don't provide a Log ID, Humanloop will generate one for you. */
    logId?: string;
    /** The message returned by the LLM. Only populated for LLM Evaluator Logs. */
    outputMessage?: Humanloop.ChatMessage;
    /** Evaluator assessment of the Log. */
    judgment?: Humanloop.CreateEvaluatorLogRequestJudgment;
    /** Whether the Log has been manually marked as completed by a user. */
    markedCompleted?: boolean;
    spec?: Humanloop.CreateEvaluatorLogRequestSpec;
}
