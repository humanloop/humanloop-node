/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../../../../index";

/**
 * @example
 *     {
 *         path: "math-tool",
 *         tool: {
 *             function: {
 *                 name: "multiply",
 *                 description: "Multiply two numbers",
 *                 parameters: {
 *                     "type": "object",
 *                     "properties": {
 *                         "a": {
 *                             "type": "number"
 *                         },
 *                         "b": {
 *                             "type": "number"
 *                         }
 *                     },
 *                     "required": [
 *                         "a",
 *                         "b"
 *                     ]
 *                 }
 *             }
 *         },
 *         inputs: {
 *             "a": 5,
 *             "b": 7
 *         },
 *         output: "35"
 *     }
 */
export interface ToolLogRequest {
    /**
     * A specific Version ID of the Tool to log to.
     */
    versionId?: string;
    /**
     * Name of the Environment identifying a deployed version to log to.
     */
    environment?: string;
    /** Path of the Tool, including the name. This locates the Tool in the Humanloop filesystem and is used as as a unique identifier. For example: `folder/name` or just `name`. */
    path?: string;
    /** ID for an existing Tool. */
    id?: string;
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
    /** Status of a Log. Set to `incomplete` if you intend to update and eventually complete the Log and want the File's monitoring Evaluators to wait until you mark it as `complete`. If log_status is not provided, observability will pick up the Log as soon as possible. Updating this from specified to unspecified is undefined behavior. */
    logStatus?: Humanloop.LogStatus;
    /** Unique identifier for the Datapoint that this Log is derived from. This can be used by Humanloop to associate Logs to Evaluations. If provided, Humanloop will automatically associate this Log to Evaluations that require a Log for this Datapoint-Version pair. */
    sourceDatapointId?: string;
    /** The ID of the parent Log to nest this Log under in a Trace. */
    traceParentId?: string;
    /** End-user ID related to the Log. */
    user?: string;
    /** The name of the Environment the Log is associated to. */
    toolLogRequestEnvironment?: string;
    /** Whether the request/response payloads will be stored on Humanloop. */
    save?: boolean;
    /** This will identify a Log. If you don't provide a Log ID, Humanloop will generate one for you. */
    logId?: string;
    /** Details of your Tool. A new Tool version will be created if the provided details are new. */
    tool?: Humanloop.ToolKernelRequest;
}
