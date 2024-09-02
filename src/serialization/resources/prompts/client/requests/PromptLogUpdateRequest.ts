/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../index";
import * as Humanloop from "../../../../../api/index";
import * as core from "../../../../../core";
import { ChatMessage } from "../../../../types/ChatMessage";
import { PromptLogUpdateRequestToolChoice } from "../../types/PromptLogUpdateRequestToolChoice";

export const PromptLogUpdateRequest: core.serialization.Schema<
    serializers.PromptLogUpdateRequest.Raw,
    Humanloop.PromptLogUpdateRequest
> = core.serialization.object({
    outputMessage: core.serialization.property("output_message", ChatMessage.optional()),
    promptTokens: core.serialization.property("prompt_tokens", core.serialization.number().optional()),
    outputTokens: core.serialization.property("output_tokens", core.serialization.number().optional()),
    promptCost: core.serialization.property("prompt_cost", core.serialization.number().optional()),
    outputCost: core.serialization.property("output_cost", core.serialization.number().optional()),
    finishReason: core.serialization.property("finish_reason", core.serialization.string().optional()),
    messages: core.serialization.list(ChatMessage).optional(),
    toolChoice: core.serialization.property("tool_choice", PromptLogUpdateRequestToolChoice.optional()),
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
});

export declare namespace PromptLogUpdateRequest {
    interface Raw {
        output_message?: ChatMessage.Raw | null;
        prompt_tokens?: number | null;
        output_tokens?: number | null;
        prompt_cost?: number | null;
        output_cost?: number | null;
        finish_reason?: string | null;
        messages?: ChatMessage.Raw[] | null;
        tool_choice?: PromptLogUpdateRequestToolChoice.Raw | null;
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
    }
}
