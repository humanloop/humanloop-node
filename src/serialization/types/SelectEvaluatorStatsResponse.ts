/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const SelectEvaluatorStatsResponse: core.serialization.ObjectSchema<
    serializers.SelectEvaluatorStatsResponse.Raw,
    Humanloop.SelectEvaluatorStatsResponse
> = core.serialization.object({
    evaluatorVersionId: core.serialization.property("evaluator_version_id", core.serialization.string()),
    totalLogs: core.serialization.property("total_logs", core.serialization.number()),
    numJudgments: core.serialization.property("num_judgments", core.serialization.number()),
    numNulls: core.serialization.property("num_nulls", core.serialization.number()),
    numErrors: core.serialization.property("num_errors", core.serialization.number()),
    numJudgmentsPerOption: core.serialization.property(
        "num_judgments_per_option",
        core.serialization.record(core.serialization.string(), core.serialization.number()),
    ),
});

export declare namespace SelectEvaluatorStatsResponse {
    export interface Raw {
        evaluator_version_id: string;
        total_logs: number;
        num_judgments: number;
        num_nulls: number;
        num_errors: number;
        num_judgments_per_option: Record<string, number>;
    }
}
