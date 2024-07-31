/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { ChatMessageWithToolCall } from "./ChatMessageWithToolCall";
import { SrcExternalAppModelsV4LogLogResponseJudgment } from "./SrcExternalAppModelsV4LogLogResponseJudgment";
import { ConfigResponse } from "./ConfigResponse";
import { FeedbackResponse } from "./FeedbackResponse";
import { MetricValueResponse } from "./MetricValueResponse";
import { ToolResultResponse } from "./ToolResultResponse";
import { SrcExternalAppModelsV4LogLogResponseToolChoice } from "./SrcExternalAppModelsV4LogLogResponseToolChoice";
import { ObservabilityStatus } from "./ObservabilityStatus";

export const SrcExternalAppModelsV4LogLogResponse: core.serialization.ObjectSchema<
    serializers.SrcExternalAppModelsV4LogLogResponse.Raw,
    Humanloop.SrcExternalAppModelsV4LogLogResponse
> = core.serialization.object({
    project: core.serialization.string().optional(),
    projectId: core.serialization.property("project_id", core.serialization.string().optional()),
    sessionId: core.serialization.property("session_id", core.serialization.string().optional()),
    sessionReferenceId: core.serialization.property("session_reference_id", core.serialization.string().optional()),
    parentId: core.serialization.property("parent_id", core.serialization.string().optional()),
    parentReferenceId: core.serialization.property("parent_reference_id", core.serialization.string().optional()),
    inputs: core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
    source: core.serialization.string().optional(),
    metadata: core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
    save: core.serialization.boolean().optional(),
    sourceDatapointId: core.serialization.property("source_datapoint_id", core.serialization.string().optional()),
    id: core.serialization.string(),
    referenceId: core.serialization.property("reference_id", core.serialization.string().optional()),
    trialId: core.serialization.property("trial_id", core.serialization.string().optional()),
    messages: core.serialization.list(ChatMessageWithToolCall).optional(),
    output: core.serialization.string().optional(),
    judgment: SrcExternalAppModelsV4LogLogResponseJudgment.optional(),
    configId: core.serialization.property("config_id", core.serialization.string().optional()),
    config: ConfigResponse,
    environment: core.serialization.string().optional(),
    feedback: core.serialization.list(FeedbackResponse).optional(),
    createdAt: core.serialization.property("created_at", core.serialization.date().optional()),
    error: core.serialization.string().optional(),
    duration: core.serialization.number().optional(),
    outputMessage: core.serialization.property("output_message", ChatMessageWithToolCall.optional()),
    promptTokens: core.serialization.property("prompt_tokens", core.serialization.number().optional()),
    outputTokens: core.serialization.property("output_tokens", core.serialization.number().optional()),
    promptCost: core.serialization.property("prompt_cost", core.serialization.number().optional()),
    outputCost: core.serialization.property("output_cost", core.serialization.number().optional()),
    providerRequest: core.serialization.property(
        "provider_request",
        core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional()
    ),
    providerResponse: core.serialization.property(
        "provider_response",
        core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional()
    ),
    user: core.serialization.string().optional(),
    providerLatency: core.serialization.property("provider_latency", core.serialization.number().optional()),
    tokens: core.serialization.number().optional(),
    rawOutput: core.serialization.property("raw_output", core.serialization.string().optional()),
    finishReason: core.serialization.property("finish_reason", core.serialization.string().optional()),
    metricValues: core.serialization.property("metric_values", core.serialization.list(MetricValueResponse).optional()),
    tools: core.serialization.list(ToolResultResponse).optional(),
    toolChoice: core.serialization.property("tool_choice", SrcExternalAppModelsV4LogLogResponseToolChoice.optional()),
    evaluationResults: core.serialization.property(
        "evaluation_results",
        core.serialization.list(core.serialization.lazyObject(() => serializers.EvaluationResultResponse))
    ),
    observabilityStatus: core.serialization.property("observability_status", ObservabilityStatus),
    updatedAt: core.serialization.property("updated_at", core.serialization.date()),
    batchIds: core.serialization.property("batch_ids", core.serialization.list(core.serialization.string()).optional()),
});

export declare namespace SrcExternalAppModelsV4LogLogResponse {
    interface Raw {
        project?: string | null;
        project_id?: string | null;
        session_id?: string | null;
        session_reference_id?: string | null;
        parent_id?: string | null;
        parent_reference_id?: string | null;
        inputs?: Record<string, unknown> | null;
        source?: string | null;
        metadata?: Record<string, unknown> | null;
        save?: boolean | null;
        source_datapoint_id?: string | null;
        id: string;
        reference_id?: string | null;
        trial_id?: string | null;
        messages?: ChatMessageWithToolCall.Raw[] | null;
        output?: string | null;
        judgment?: SrcExternalAppModelsV4LogLogResponseJudgment.Raw | null;
        config_id?: string | null;
        config: ConfigResponse.Raw;
        environment?: string | null;
        feedback?: FeedbackResponse.Raw[] | null;
        created_at?: string | null;
        error?: string | null;
        duration?: number | null;
        output_message?: ChatMessageWithToolCall.Raw | null;
        prompt_tokens?: number | null;
        output_tokens?: number | null;
        prompt_cost?: number | null;
        output_cost?: number | null;
        provider_request?: Record<string, unknown> | null;
        provider_response?: Record<string, unknown> | null;
        user?: string | null;
        provider_latency?: number | null;
        tokens?: number | null;
        raw_output?: string | null;
        finish_reason?: string | null;
        metric_values?: MetricValueResponse.Raw[] | null;
        tools?: ToolResultResponse.Raw[] | null;
        tool_choice?: SrcExternalAppModelsV4LogLogResponseToolChoice.Raw | null;
        evaluation_results: serializers.EvaluationResultResponse.Raw[];
        observability_status: ObservabilityStatus.Raw;
        updated_at: string;
        batch_ids?: string[] | null;
    }
}
