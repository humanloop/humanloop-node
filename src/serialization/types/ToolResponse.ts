/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { ToolFunction } from "./ToolFunction";
import { FilesToolType } from "./FilesToolType";
import { EnvironmentResponse } from "./EnvironmentResponse";
import { UserResponse } from "./UserResponse";
import { VersionStatus } from "./VersionStatus";
import { InputResponse } from "./InputResponse";
import { EvaluatorAggregate } from "./EvaluatorAggregate";

export const ToolResponse: core.serialization.ObjectSchema<serializers.ToolResponse.Raw, Humanloop.ToolResponse> =
    core.serialization.object({
        path: core.serialization.string(),
        id: core.serialization.string(),
        directoryId: core.serialization.property("directory_id", core.serialization.string().optional()),
        function: ToolFunction.optional(),
        sourceCode: core.serialization.property("source_code", core.serialization.string().optional()),
        setupValues: core.serialization.property(
            "setup_values",
            core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional()
        ),
        attributes: core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
        toolType: core.serialization.property("tool_type", FilesToolType.optional()),
        commitMessage: core.serialization.property("commit_message", core.serialization.string().optional()),
        name: core.serialization.string(),
        versionId: core.serialization.property("version_id", core.serialization.string()),
        type: core.serialization.stringLiteral("tool").optional(),
        environments: core.serialization.list(EnvironmentResponse).optional(),
        createdAt: core.serialization.property("created_at", core.serialization.date()),
        updatedAt: core.serialization.property("updated_at", core.serialization.date()),
        createdBy: core.serialization.property("created_by", UserResponse.optional()),
        committedBy: core.serialization.property("committed_by", UserResponse.optional()),
        committedAt: core.serialization.property("committed_at", core.serialization.date().optional()),
        status: VersionStatus,
        lastUsedAt: core.serialization.property("last_used_at", core.serialization.date()),
        versionLogsCount: core.serialization.property("version_logs_count", core.serialization.number()),
        totalLogsCount: core.serialization.property("total_logs_count", core.serialization.number()),
        inputs: core.serialization.list(InputResponse),
        evaluators: core.serialization
            .list(core.serialization.lazyObject(() => serializers.MonitoringEvaluatorResponse))
            .optional(),
        signature: core.serialization.string().optional(),
        evaluatorAggregates: core.serialization.property(
            "evaluator_aggregates",
            core.serialization.list(EvaluatorAggregate).optional()
        ),
    });

export declare namespace ToolResponse {
    interface Raw {
        path: string;
        id: string;
        directory_id?: string | null;
        function?: ToolFunction.Raw | null;
        source_code?: string | null;
        setup_values?: Record<string, unknown> | null;
        attributes?: Record<string, unknown> | null;
        tool_type?: FilesToolType.Raw | null;
        commit_message?: string | null;
        name: string;
        version_id: string;
        type?: "tool" | null;
        environments?: EnvironmentResponse.Raw[] | null;
        created_at: string;
        updated_at: string;
        created_by?: (UserResponse.Raw | undefined) | null;
        committed_by?: (UserResponse.Raw | undefined) | null;
        committed_at?: string | null;
        status: VersionStatus.Raw;
        last_used_at: string;
        version_logs_count: number;
        total_logs_count: number;
        inputs: InputResponse.Raw[];
        evaluators?: serializers.MonitoringEvaluatorResponse.Raw[] | null;
        signature?: string | null;
        evaluator_aggregates?: EvaluatorAggregate.Raw[] | null;
    }
}
