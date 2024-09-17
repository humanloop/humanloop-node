/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { ModelEndpoints } from "./ModelEndpoints";
import { PromptResponseTemplate } from "./PromptResponseTemplate";
import { ModelProviders } from "./ModelProviders";
import { PromptResponseStop } from "./PromptResponseStop";
import { ResponseFormat } from "./ResponseFormat";
import { ToolFunction } from "./ToolFunction";
import { LinkedToolResponse } from "./LinkedToolResponse";
import { EnvironmentResponse } from "./EnvironmentResponse";
import { UserResponse } from "./UserResponse";
import { VersionStatus } from "./VersionStatus";
import { InputResponse } from "./InputResponse";
import { EvaluatorAggregate } from "./EvaluatorAggregate";

export const PromptResponse: core.serialization.ObjectSchema<serializers.PromptResponse.Raw, Humanloop.PromptResponse> =
    core.serialization.object({
        path: core.serialization.string(),
        id: core.serialization.string(),
        directoryId: core.serialization.property("directory_id", core.serialization.string().optional()),
        model: core.serialization.string(),
        endpoint: ModelEndpoints.optional(),
        template: PromptResponseTemplate.optional(),
        provider: ModelProviders.optional(),
        maxTokens: core.serialization.property("max_tokens", core.serialization.number().optional()),
        temperature: core.serialization.number().optional(),
        topP: core.serialization.property("top_p", core.serialization.number().optional()),
        stop: PromptResponseStop.optional(),
        presencePenalty: core.serialization.property("presence_penalty", core.serialization.number().optional()),
        frequencyPenalty: core.serialization.property("frequency_penalty", core.serialization.number().optional()),
        other: core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
        seed: core.serialization.number().optional(),
        responseFormat: core.serialization.property("response_format", ResponseFormat.optional()),
        tools: core.serialization.list(ToolFunction).optional(),
        linkedTools: core.serialization.property(
            "linked_tools",
            core.serialization.list(LinkedToolResponse).optional()
        ),
        attributes: core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
        commitMessage: core.serialization.property("commit_message", core.serialization.string().optional()),
        name: core.serialization.string(),
        versionId: core.serialization.property("version_id", core.serialization.string()),
        type: core.serialization.stringLiteral("prompt").optional(),
        environments: core.serialization.list(EnvironmentResponse).optional(),
        createdAt: core.serialization.property("created_at", core.serialization.date()),
        updatedAt: core.serialization.property("updated_at", core.serialization.date()),
        createdBy: core.serialization.property("created_by", UserResponse.optional()),
        status: VersionStatus,
        lastUsedAt: core.serialization.property("last_used_at", core.serialization.date()),
        versionLogsCount: core.serialization.property("version_logs_count", core.serialization.number()),
        totalLogsCount: core.serialization.property("total_logs_count", core.serialization.number()),
        inputs: core.serialization.list(InputResponse),
        evaluators: core.serialization
            .list(core.serialization.lazyObject(() => serializers.MonitoringEvaluatorResponse))
            .optional(),
        evaluatorAggregates: core.serialization.property(
            "evaluator_aggregates",
            core.serialization.list(EvaluatorAggregate).optional()
        ),
    });

export declare namespace PromptResponse {
    interface Raw {
        path: string;
        id: string;
        directory_id?: string | null;
        model: string;
        endpoint?: ModelEndpoints.Raw | null;
        template?: PromptResponseTemplate.Raw | null;
        provider?: ModelProviders.Raw | null;
        max_tokens?: number | null;
        temperature?: number | null;
        top_p?: number | null;
        stop?: PromptResponseStop.Raw | null;
        presence_penalty?: number | null;
        frequency_penalty?: number | null;
        other?: Record<string, unknown> | null;
        seed?: number | null;
        response_format?: ResponseFormat.Raw | null;
        tools?: ToolFunction.Raw[] | null;
        linked_tools?: LinkedToolResponse.Raw[] | null;
        attributes?: Record<string, unknown> | null;
        commit_message?: string | null;
        name: string;
        version_id: string;
        type?: "prompt" | null;
        environments?: EnvironmentResponse.Raw[] | null;
        created_at: string;
        updated_at: string;
        created_by?: (UserResponse.Raw | undefined) | null;
        status: VersionStatus.Raw;
        last_used_at: string;
        version_logs_count: number;
        total_logs_count: number;
        inputs: InputResponse.Raw[];
        evaluators?: serializers.MonitoringEvaluatorResponse.Raw[] | null;
        evaluator_aggregates?: EvaluatorAggregate.Raw[] | null;
    }
}
