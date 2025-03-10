/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { VersionStatsResponseEvaluatorVersionStatsItem } from "./VersionStatsResponseEvaluatorVersionStatsItem";

export const VersionStatsResponse: core.serialization.ObjectSchema<
    serializers.VersionStatsResponse.Raw,
    Humanloop.VersionStatsResponse
> = core.serialization.object({
    versionId: core.serialization.property("version_id", core.serialization.string()),
    batchId: core.serialization.property("batch_id", core.serialization.string().optional()),
    numLogs: core.serialization.property("num_logs", core.serialization.number()),
    evaluatorVersionStats: core.serialization.property(
        "evaluator_version_stats",
        core.serialization.list(VersionStatsResponseEvaluatorVersionStatsItem),
    ),
});

export declare namespace VersionStatsResponse {
    export interface Raw {
        version_id: string;
        batch_id?: string | null;
        num_logs: number;
        evaluator_version_stats: VersionStatsResponseEvaluatorVersionStatsItem.Raw[];
    }
}
