/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const ProviderApiKeys: core.serialization.ObjectSchema<
    serializers.ProviderApiKeys.Raw,
    Humanloop.ProviderApiKeys
> = core.serialization.object({
    openai: core.serialization.string().optional(),
    ai21: core.serialization.string().optional(),
    mock: core.serialization.string().optional(),
    anthropic: core.serialization.string().optional(),
    cohere: core.serialization.string().optional(),
    openaiAzure: core.serialization.property("openai_azure", core.serialization.string().optional()),
    openaiAzureEndpoint: core.serialization.property("openai_azure_endpoint", core.serialization.string().optional()),
});

export declare namespace ProviderApiKeys {
    interface Raw {
        openai?: string | null;
        ai21?: string | null;
        mock?: string | null;
        anthropic?: string | null;
        cohere?: string | null;
        openai_azure?: string | null;
        openai_azure_endpoint?: string | null;
    }
}
