/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { ChatMessage } from "./ChatMessage";

export const PromptCallLogResponse: core.serialization.ObjectSchema<
    serializers.PromptCallLogResponse.Raw,
    Humanloop.PromptCallLogResponse
> = core.serialization.object({
    output: core.serialization.string().optional(),
    createdAt: core.serialization.property("created_at", core.serialization.date().optional()),
    error: core.serialization.string().optional(),
    providerLatency: core.serialization.property("provider_latency", core.serialization.number().optional()),
    stdout: core.serialization.string().optional(),
    outputMessage: core.serialization.property("output_message", ChatMessage.optional()),
    promptTokens: core.serialization.property("prompt_tokens", core.serialization.number().optional()),
    outputTokens: core.serialization.property("output_tokens", core.serialization.number().optional()),
    promptCost: core.serialization.property("prompt_cost", core.serialization.number().optional()),
    outputCost: core.serialization.property("output_cost", core.serialization.number().optional()),
    finishReason: core.serialization.property("finish_reason", core.serialization.string().optional()),
    index: core.serialization.number(),
});

export declare namespace PromptCallLogResponse {
    interface Raw {
        output?: string | null;
        created_at?: string | null;
        error?: string | null;
        provider_latency?: number | null;
        stdout?: string | null;
        output_message?: ChatMessage.Raw | null;
        prompt_tokens?: number | null;
        output_tokens?: number | null;
        prompt_cost?: number | null;
        output_cost?: number | null;
        finish_reason?: string | null;
        index: number;
    }
}
