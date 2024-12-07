/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

export interface EvaluationLogResponse {
    /** Unique identifier for the Run. */
    runId: string;
    /** The Datapoint used to generate the Log */
    datapoint?: Humanloop.DatapointResponse;
    /** The Log that was evaluated by the Evaluator. */
    log: Humanloop.LogResponse;
    /** The Evaluator Logs containing the judgments for the Log. */
    evaluatorLogs: Humanloop.LogResponse[];
}