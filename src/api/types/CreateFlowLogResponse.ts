/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

/**
 * Response for a Flow Log.
 */
export interface CreateFlowLogResponse {
    /** Unique identifier for the Log. */
    id: string;
    /** Unique identifier for the Flow. */
    flowId: string;
    /** Unique identifier for the Flow Version. */
    versionId: string;
    /** Status of the Flow Log. When a Flow Log is marked as `complete`, no more Logs can be added to it. Monitoring Evaluators will only run on `complete` Flow Logs. */
    logStatus?: Humanloop.LogStatus;
}
