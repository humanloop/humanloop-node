/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

export interface EvaluationStats {
    /** Stats for the Evaluation Report as a whole. */
    overallStats: Humanloop.OverallStats;
    /** Stats for each Evaluated Version in the Evaluation Report. */
    versionStats: Humanloop.VersionStatsResponse[];
    /** A summary string report of the Evaluation's progress you can print to the command line;helpful when integrating Evaluations with CI/CD. */
    progress?: string;
    /** A summary string report of the Evaluation you can print to command line;helpful when integrating Evaluations with CI/CD. */
    report?: string;
    /** The current status of the Evaluation. */
    status: Humanloop.EvaluationStatus;
}
