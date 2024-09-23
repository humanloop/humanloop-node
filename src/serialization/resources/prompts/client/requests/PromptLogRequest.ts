/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../index";
import * as Humanloop from "../../../../../api/index";
import * as core from "../../../../../core";
import { ChatMessage } from "../../../../types/ChatMessage";
import { PromptLogRequestToolChoice } from "../../types/PromptLogRequestToolChoice";
import { PromptKernelRequest } from "../../../../types/PromptKernelRequest";

export const PromptLogRequest: core.serialization.Schema<
    serializers.PromptLogRequest.Raw,
    Omit<Humanloop.PromptLogRequest, "versionId" | "environment">
> = core.serialization.object({
    evaluationId: core.serialization.property("evaluation_id", core.serialization.string().optional()),
    path: core.serialization.string().optional(),
    id: core.serialization.string().optional(),
    outputMessage: core.serialization.property("output_message", ChatMessage.optional()),
    promptTokens: core.serialization.property("prompt_tokens", core.serialization.number().optional()),
    outputTokens: core.serialization.property("output_tokens", core.serialization.number().optional()),
    promptCost: core.serialization.property("prompt_cost", core.serialization.number().optional()),
    outputCost: core.serialization.property("output_cost", core.serialization.number().optional()),
    finishReason: core.serialization.property("finish_reason", core.serialization.string().optional()),
    messages: core.serialization.list(ChatMessage).optional(),
    toolChoice: core.serialization.property("tool_choice", PromptLogRequestToolChoice.optional()),
    prompt: PromptKernelRequest.optional(),
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
    traceParentId: core.serialization.property("trace_parent_id", core.serialization.string().optional()),
    batches: core.serialization.list(core.serialization.string()).optional(),
    user: core.serialization.string().optional(),
    promptLogRequestEnvironment: core.serialization.property("environment", core.serialization.string().optional()),
    save: core.serialization.boolean().optional(),
});

export declare namespace PromptLogRequest {
    interface Raw {
        evaluation_id?: string | null;
        path?: string | null;
        id?: string | null;
        output_message?: ChatMessage.Raw | null;
        prompt_tokens?: number | null;
        output_tokens?: number | null;
        prompt_cost?: number | null;
        output_cost?: number | null;
        finish_reason?: string | null;
        messages?: ChatMessage.Raw[] | null;
        tool_choice?: PromptLogRequestToolChoice.Raw | null;
        prompt?: PromptKernelRequest.Raw | null;
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
        trace_parent_id?: string | null;
        batches?: string[] | null;
        user?: string | null;
        environment?: string | null;
        save?: boolean | null;
    }
}
