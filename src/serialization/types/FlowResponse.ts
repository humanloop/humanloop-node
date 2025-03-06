/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { EnvironmentResponse } from "./EnvironmentResponse";
import { UserResponse } from "./UserResponse";
import { VersionStatus } from "./VersionStatus";
import { EvaluatorAggregate } from "./EvaluatorAggregate";

export const FlowResponse: core.serialization.ObjectSchema<serializers.FlowResponse.Raw, Humanloop.FlowResponse> =
    core.serialization.object({
        path: core.serialization.string(),
        id: core.serialization.string(),
        directoryId: core.serialization.property("directory_id", core.serialization.string().optional()),
        attributes: core.serialization.record(core.serialization.string(), core.serialization.unknown()),
        commitMessage: core.serialization.property("commit_message", core.serialization.string().optional()),
        name: core.serialization.string(),
        description: core.serialization.string().optional(),
        readme: core.serialization.string().optional(),
        tags: core.serialization.list(core.serialization.string()).optional(),
        versionId: core.serialization.property("version_id", core.serialization.string()),
        type: core.serialization.stringLiteral("flow").optional(),
        environments: core.serialization.list(EnvironmentResponse).optional(),
        createdAt: core.serialization.property("created_at", core.serialization.date()),
        updatedAt: core.serialization.property("updated_at", core.serialization.date()),
        createdBy: core.serialization.property("created_by", UserResponse.optional()),
        committedBy: core.serialization.property("committed_by", UserResponse.optional()),
        committedAt: core.serialization.property("committed_at", core.serialization.date().optional()),
        status: VersionStatus,
        lastUsedAt: core.serialization.property("last_used_at", core.serialization.date()),
        versionLogsCount: core.serialization.property("version_logs_count", core.serialization.number()),
        evaluatorAggregates: core.serialization.property(
            "evaluator_aggregates",
            core.serialization.list(EvaluatorAggregate).optional(),
        ),
        evaluators: core.serialization
            .list(core.serialization.lazyObject(() => serializers.MonitoringEvaluatorResponse))
            .optional(),
    });

export declare namespace FlowResponse {
    export interface Raw {
        path: string;
        id: string;
        directory_id?: string | null;
        attributes: Record<string, unknown>;
        commit_message?: string | null;
        name: string;
        description?: string | null;
        readme?: string | null;
        tags?: string[] | null;
        version_id: string;
        type?: "flow" | null;
        environments?: EnvironmentResponse.Raw[] | null;
        created_at: string;
        updated_at: string;
        created_by?: (UserResponse.Raw | undefined) | null;
        committed_by?: (UserResponse.Raw | undefined) | null;
        committed_at?: string | null;
        status: VersionStatus.Raw;
        last_used_at: string;
        version_logs_count: number;
        evaluator_aggregates?: EvaluatorAggregate.Raw[] | null;
        evaluators?: serializers.MonitoringEvaluatorResponse.Raw[] | null;
    }
}
