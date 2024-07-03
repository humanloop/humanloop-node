/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

export interface EvaluateeResponse {
    version: Humanloop.EvaluatedVersionResponse;
    /** Unique identifier for the batch of Logs to include in the Evaluation Report. */
    batchId?: string;
    /** Whether the Prompt/Tool is orchestrated by Humanloop. Default is `True`. If `False`, a log for the Prompt/Tool should be submitted by the user via the API. */
    orchestrated: boolean;
}
