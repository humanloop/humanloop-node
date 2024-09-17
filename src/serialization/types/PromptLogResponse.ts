/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { ChatMessage } from "./ChatMessage";
import { PromptLogResponseToolChoice } from "./PromptLogResponseToolChoice";
import { TraceStatus } from "./TraceStatus";

export const PromptLogResponse: core.serialization.ObjectSchema<
    serializers.PromptLogResponse.Raw,
    Humanloop.PromptLogResponse
> = core.serialization.object({
    outputMessage: core.serialization.property("output_message", ChatMessage.optional()),
    promptTokens: core.serialization.property("prompt_tokens", core.serialization.number().optional()),
    outputTokens: core.serialization.property("output_tokens", core.serialization.number().optional()),
    promptCost: core.serialization.property("prompt_cost", core.serialization.number().optional()),
    outputCost: core.serialization.property("output_cost", core.serialization.number().optional()),
    finishReason: core.serialization.property("finish_reason", core.serialization.string().optional()),
    messages: core.serialization.list(ChatMessage).optional(),
    toolChoice: core.serialization.property("tool_choice", PromptLogResponseToolChoice.optional()),
    prompt: core.serialization.lazyObject(() => serializers.PromptResponse),
    startTime: core.serialization.property("start_time", core.serialization.date().optional()),
    endTime: core.serialization.property("end_time", core.serialization.date().optional()),
    output: core.serialization.string().optional(),
    createdAt: core.serialization.property("created_at", core.serialization.date().optional()),
    error: core.serialization.string().optional(),
    providerLatency: core.serialization.property("provider_latency", core.serialization.number().optional()),
    stdout: core.serialization.string().optional(),
    providerRequest: core.serialization.property(
        "provider_request",
        core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional()
    ),
    providerResponse: core.serialization.property(
        "provider_response",
        core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional()
    ),
    inputs: core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
    source: core.serialization.string().optional(),
    metadata: core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
    sourceDatapointId: core.serialization.property("source_datapoint_id", core.serialization.string().optional()),
    traceId: core.serialization.property("trace_id", core.serialization.string().optional()),
    traceParentLogId: core.serialization.property("trace_parent_log_id", core.serialization.string().optional()),
    batches: core.serialization.list(core.serialization.string()).optional(),
    user: core.serialization.string().optional(),
    environment: core.serialization.string().optional(),
    save: core.serialization.boolean().optional(),
    id: core.serialization.string(),
    evaluatorLogs: core.serialization.property(
        "evaluator_logs",
        core.serialization.list(core.serialization.lazyObject(() => serializers.EvaluatorLogResponse))
    ),
    traceFlowId: core.serialization.property("trace_flow_id", core.serialization.string().optional()),
    traceStatus: core.serialization.property("trace_status", TraceStatus.optional()),
    traceChildren: core.serialization.property(
        "trace_children",
        core.serialization.list(core.serialization.lazy(() => serializers.LogResponse)).optional()
    ),
});

export declare namespace PromptLogResponse {
    interface Raw {
        output_message?: ChatMessage.Raw | null;
        prompt_tokens?: number | null;
        output_tokens?: number | null;
        prompt_cost?: number | null;
        output_cost?: number | null;
        finish_reason?: string | null;
        messages?: ChatMessage.Raw[] | null;
        tool_choice?: PromptLogResponseToolChoice.Raw | null;
        prompt: serializers.PromptResponse.Raw;
        start_time?: string | null;
        end_time?: string | null;
        output?: string | null;
        created_at?: string | null;
        error?: string | null;
        provider_latency?: number | null;
        stdout?: string | null;
        provider_request?: Record<string, unknown> | null;
        provider_response?: Record<string, unknown> | null;
        inputs?: Record<string, unknown> | null;
        source?: string | null;
        metadata?: Record<string, unknown> | null;
        source_datapoint_id?: string | null;
        trace_id?: string | null;
        trace_parent_log_id?: string | null;
        batches?: string[] | null;
        user?: string | null;
        environment?: string | null;
        save?: boolean | null;
        id: string;
        evaluator_logs: serializers.EvaluatorLogResponse.Raw[];
        trace_flow_id?: string | null;
        trace_status?: TraceStatus.Raw | null;
        trace_children?: serializers.LogResponse.Raw[] | null;
    }
}
