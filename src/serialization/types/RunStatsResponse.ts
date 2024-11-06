/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { RunStatsResponseEvaluatorStatsItem } from "./RunStatsResponseEvaluatorStatsItem";
import { EvaluationStatus } from "./EvaluationStatus";

export const RunStatsResponse: core.serialization.ObjectSchema<
    serializers.RunStatsResponse.Raw,
    Humanloop.RunStatsResponse
> = core.serialization.object({
    runId: core.serialization.property("run_id", core.serialization.string()),
    versionId: core.serialization.property("version_id", core.serialization.string().optional()),
    batchId: core.serialization.property("batch_id", core.serialization.string().optional()),
    numLogs: core.serialization.property("num_logs", core.serialization.number()),
    evaluatorStats: core.serialization.property(
        "evaluator_stats",
        core.serialization.list(RunStatsResponseEvaluatorStatsItem)
    ),
    status: EvaluationStatus,
});

export declare namespace RunStatsResponse {
    interface Raw {
        run_id: string;
        version_id?: string | null;
        batch_id?: string | null;
        num_logs: number;
        evaluator_stats: RunStatsResponseEvaluatorStatsItem.Raw[];
        status: EvaluationStatus.Raw;
    }
}
