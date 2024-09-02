/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../index";
import * as Humanloop from "../../../../../api/index";
import * as core from "../../../../../core";
import { ModelEndpoints } from "../../../../types/ModelEndpoints";
import { PromptRequestTemplate } from "../../types/PromptRequestTemplate";
import { ModelProviders } from "../../../../types/ModelProviders";
import { PromptRequestStop } from "../../types/PromptRequestStop";
import { ResponseFormat } from "../../../../types/ResponseFormat";
import { ToolFunction } from "../../../../types/ToolFunction";

export const PromptRequest: core.serialization.Schema<serializers.PromptRequest.Raw, Humanloop.PromptRequest> =
    core.serialization.object({
        path: core.serialization.string().optional(),
        id: core.serialization.string().optional(),
        model: core.serialization.string(),
        endpoint: ModelEndpoints.optional(),
        template: PromptRequestTemplate.optional(),
        provider: ModelProviders.optional(),
        maxTokens: core.serialization.property("max_tokens", core.serialization.number().optional()),
        temperature: core.serialization.number().optional(),
        topP: core.serialization.property("top_p", core.serialization.number().optional()),
        stop: PromptRequestStop.optional(),
        presencePenalty: core.serialization.property("presence_penalty", core.serialization.number().optional()),
        frequencyPenalty: core.serialization.property("frequency_penalty", core.serialization.number().optional()),
        other: core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
        seed: core.serialization.number().optional(),
        responseFormat: core.serialization.property("response_format", ResponseFormat.optional()),
        tools: core.serialization.list(ToolFunction).optional(),
        linkedTools: core.serialization.property(
            "linked_tools",
            core.serialization.list(core.serialization.string()).optional()
        ),
        attributes: core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
        commitMessage: core.serialization.property("commit_message", core.serialization.string().optional()),
    });

export declare namespace PromptRequest {
    interface Raw {
        path?: string | null;
        id?: string | null;
        model: string;
        endpoint?: ModelEndpoints.Raw | null;
        template?: PromptRequestTemplate.Raw | null;
        provider?: ModelProviders.Raw | null;
        max_tokens?: number | null;
        temperature?: number | null;
        top_p?: number | null;
        stop?: PromptRequestStop.Raw | null;
        presence_penalty?: number | null;
        frequency_penalty?: number | null;
        other?: Record<string, unknown> | null;
        seed?: number | null;
        response_format?: ResponseFormat.Raw | null;
        tools?: ToolFunction.Raw[] | null;
        linked_tools?: string[] | null;
        attributes?: Record<string, unknown> | null;
        commit_message?: string | null;
    }
}
