/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { ChatMessage } from "./ChatMessage";

export const PromptCallStreamResponse: core.serialization.ObjectSchema<
    serializers.PromptCallStreamResponse.Raw,
    Humanloop.PromptCallStreamResponse
> = core.serialization.object({
    output: core.serialization.string().optional(),
    rawOutput: core.serialization.property("raw_output", core.serialization.string().optional()),
    createdAt: core.serialization.property("created_at", core.serialization.date().optional()),
    error: core.serialization.string().optional(),
    providerLatency: core.serialization.property("provider_latency", core.serialization.number().optional()),
    outputMessage: core.serialization.property("output_message", ChatMessage.optional()),
    promptTokens: core.serialization.property("prompt_tokens", core.serialization.number().optional()),
    outputTokens: core.serialization.property("output_tokens", core.serialization.number().optional()),
    promptCost: core.serialization.property("prompt_cost", core.serialization.number().optional()),
    outputCost: core.serialization.property("output_cost", core.serialization.number().optional()),
    finishReason: core.serialization.property("finish_reason", core.serialization.string().optional()),
    index: core.serialization.number(),
    id: core.serialization.string(),
    promptId: core.serialization.property("prompt_id", core.serialization.string()),
    versionId: core.serialization.property("version_id", core.serialization.string()),
});

export declare namespace PromptCallStreamResponse {
    interface Raw {
        output?: string | null;
        raw_output?: string | null;
        created_at?: string | null;
        error?: string | null;
        provider_latency?: number | null;
        output_message?: ChatMessage.Raw | null;
        prompt_tokens?: number | null;
        output_tokens?: number | null;
        prompt_cost?: number | null;
        output_cost?: number | null;
        finish_reason?: string | null;
        index: number;
        id: string;
        prompt_id: string;
        version_id: string;
    }
}
