/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { ModelEndpoints } from "./ModelEndpoints";
import { PromptKernelRequestTemplate } from "./PromptKernelRequestTemplate";
import { ModelProviders } from "./ModelProviders";
import { PromptKernelRequestStop } from "./PromptKernelRequestStop";
import { ResponseFormat } from "./ResponseFormat";
import { ReasoningEffort } from "./ReasoningEffort";
import { ToolFunction } from "./ToolFunction";

export const PromptKernelRequest: core.serialization.ObjectSchema<
    serializers.PromptKernelRequest.Raw,
    Humanloop.PromptKernelRequest
> = core.serialization.object({
    model: core.serialization.string(),
    endpoint: ModelEndpoints.optional(),
    template: PromptKernelRequestTemplate.optional(),
    provider: ModelProviders.optional(),
    maxTokens: core.serialization.property("max_tokens", core.serialization.number().optional()),
    temperature: core.serialization.number().optional(),
    topP: core.serialization.property("top_p", core.serialization.number().optional()),
    stop: PromptKernelRequestStop.optional(),
    presencePenalty: core.serialization.property("presence_penalty", core.serialization.number().optional()),
    frequencyPenalty: core.serialization.property("frequency_penalty", core.serialization.number().optional()),
    other: core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
    seed: core.serialization.number().optional(),
    responseFormat: core.serialization.property("response_format", ResponseFormat.optional()),
    reasoningEffort: core.serialization.property("reasoning_effort", ReasoningEffort.optional()),
    tools: core.serialization.list(ToolFunction).optional(),
    linkedTools: core.serialization.property(
        "linked_tools",
        core.serialization.list(core.serialization.string()).optional(),
    ),
    attributes: core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
});

export declare namespace PromptKernelRequest {
    interface Raw {
        model: string;
        endpoint?: ModelEndpoints.Raw | null;
        template?: PromptKernelRequestTemplate.Raw | null;
        provider?: ModelProviders.Raw | null;
        max_tokens?: number | null;
        temperature?: number | null;
        top_p?: number | null;
        stop?: PromptKernelRequestStop.Raw | null;
        presence_penalty?: number | null;
        frequency_penalty?: number | null;
        other?: Record<string, unknown> | null;
        seed?: number | null;
        response_format?: ResponseFormat.Raw | null;
        reasoning_effort?: ReasoningEffort.Raw | null;
        tools?: ToolFunction.Raw[] | null;
        linked_tools?: string[] | null;
        attributes?: Record<string, unknown> | null;
    }
}
