/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

export interface EvaluationStats {
    /** Stats for each Run in the Evaluation. */
    runStats: Humanloop.RunStatsResponse[];
    /** A summary string report of the Evaluation's progress you can print to the command line;helpful when integrating Evaluations with CI/CD. */
    progress?: string;
    /** A summary string report of the Evaluation you can print to command line;helpful when integrating Evaluations with CI/CD. */
    report?: string;
    /** The current status of the Evaluation. */
    status: Humanloop.EvaluationStatus;
}
