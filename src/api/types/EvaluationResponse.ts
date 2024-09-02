/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

export interface EvaluationResponse {
    /** Unique identifier for the Evaluation. Starts with `evr`. */
    id: string;
    /** The Dataset used in the Evaluation. */
    dataset: Humanloop.DatasetResponse;
    /** The Prompt/Tool Versions included in the Evaluation. */
    evaluatees: Humanloop.EvaluateeResponse[];
    /** The Evaluator Versions used to evaluate. */
    evaluators: Humanloop.EvaluationEvaluatorResponse[];
    /**
     * The current status of the Evaluation.
     *
     * - `"pending"`: The Evaluation has been created but is not actively being worked on by Humanloop.
     * - `"running"`: Humanloop is checking for any missing Logs and Evaluator Logs, and will generate them where appropriate.
     * - `"completed"`: All Logs an Evaluator Logs have been generated.
     * - `"cancelled"`: The Evaluation has been cancelled by the user. Humanloop will stop generating Logs and Evaluator Logs.
     */
    status: Humanloop.EvaluationStatus;
    createdAt: Date;
    createdBy?: Humanloop.UserResponse;
    updatedAt: Date;
    /** URL to view the Evaluation on the Humanloop. */
    url?: string;
}
