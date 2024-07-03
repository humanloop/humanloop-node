/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * Base attributes for stats for an Evaluator Version-Evaluated Version pair
 * in the Evaluation Report.
 */
export interface NumericEvaluatorVersionStats {
    /** Unique identifier for the Evaluator Version. */
    evaluatorVersionId: string;
    /** The total number of Logs generated by this Evaluator Version on the Evaluated Version's Logs. This includes Nulls and Errors. */
    totalLogs: number;
    /** The total number of Evaluator judgments for this Evaluator Version. This excludes Nulls and Errors. */
    numJudgments: number;
    /** The total number of null judgments (i.e. abstentions) for this Evaluator Version. */
    numNulls: number;
    /** The total number of errored Evaluators for this Evaluator Version. */
    numErrors: number;
    mean?: number;
    std?: number;
    percentiles: Record<string, number>;
}
