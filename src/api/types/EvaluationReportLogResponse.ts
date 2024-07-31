/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

export interface EvaluationReportLogResponse {
    /** The version of the Prompt, Tool or Evaluator that the Log belongs to. */
    evaluatedVersion: Humanloop.EvaluatedVersionResponse;
    /** The Datapoint used to generate the Log */
    datapoint: Humanloop.DatapointResponse;
    /** The Log that was evaluated by the Evaluator. */
    log?: Humanloop.SrcExternalAppModelsV5LogsLogResponse;
    /** The Evaluator Logs containing the judgments for the Log. */
    evaluatorLogs: Humanloop.SrcExternalAppModelsV5LogsLogResponse[];
}
