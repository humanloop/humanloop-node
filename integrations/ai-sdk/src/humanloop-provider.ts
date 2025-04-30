import { LanguageModelV1, NoSuchModelError, ProviderV1 } from "@ai-sdk/provider";
import {
  FetchFunction,
  loadApiKey,
  withoutTrailingSlash,
} from "@ai-sdk/provider-utils";

import { HumanloopGenerateArgs } from "./humanloop-api-types";
import { HumanloopChatLanguageModel } from "./humanloop-chat-language-model";
import { HumanloopChatModelId, HumanloopChatSettings } from "./humanloop-chat-settings";

export interface HumanloopProvider extends ProviderV1 {
    /**
Creates a model for text generation.
*/
    (modelId: HumanloopChatModelId, settings?: HumanloopChatSettings): LanguageModelV1;

    /**
Creates an Humanloop chat model for text generation.
   */
    languageModel(
        modelId: HumanloopChatModelId,
        settings?: HumanloopChatSettings,
    ): LanguageModelV1;
}

export interface HumanloopProviderSettings {
    /**
Base URL for the Humanloop API calls.
     */
    baseUrl?: string;

    /**
API key for authenticating requests.
     */
    apiKey?: string;

    /**
Custom headers to include in the requests.
     */
    headers?: Record<string, string>;

    /**
Custom fetch implementation. You can use it as a middleware to intercept requests,
or to provide a custom fetch implementation for e.g. testing.
    */
    fetch?: FetchFunction;
}

export type HumanloopProviderMetadata = Omit<
    HumanloopGenerateArgs,
    "messages" | "toolChoice" | "prompt"
> & {
    // Common prompt hyperparams are passed through the AI SDK as LanguageModelV1CallSettings
    prompt?: Omit<
        HumanloopGenerateArgs["prompt"],
        | "maxTokens"
        | "temperature"
        | "stopSequences"
        | "topP"
        | "topK"
        | "presencePenalty"
        | "frequencyPenalty"
        | "responseFormat"
        | "seed"
        | "abortSignal"
        | "headers"
    >;
};

/**
Create an Humanloop provider instance.
 */
export function createHumanloop(
    options: HumanloopProviderSettings = {},
): HumanloopProvider {
    const baseURL =
        withoutTrailingSlash(options.baseUrl) ?? "https://api.humanloop.com/v5";

    const getHeaders = () => ({
        "X-API-KEY": ` ${loadApiKey({
            apiKey: options.apiKey,
            environmentVariableName: "HUMANLOOP_API_KEY",
            description: "Humanloop",
        })}`,
        ...options.headers,
    });

    const createChatModel = (
        modelId: HumanloopChatModelId,
        settings: HumanloopChatSettings = {},
    ) =>
        new HumanloopChatLanguageModel(modelId, settings, {
            provider: "humanloop",
            url: ({ path }) => `${baseURL}${path}`,
            headers: getHeaders,
            fetch: options.fetch,
        });

    const createLanguageModel = (
        modelId: HumanloopChatModelId,
        settings?: HumanloopChatSettings,
    ) => {
        if (new.target) {
            throw new Error(
                "The Humanloop model function cannot be called with the new keyword.",
            );
        }

        return createChatModel(modelId, settings);
    };

    const provider = function (
        modelId: HumanloopChatModelId,
        settings?: HumanloopChatSettings,
    ) {
        return createLanguageModel(modelId, settings);
    };

    provider.languageModel = createLanguageModel;
    provider.chat = createChatModel;
    provider.textEmbeddingModel = (modelId: string) => {
        throw new NoSuchModelError({ modelId, modelType: "textEmbeddingModel" });
    };

    return provider;
}

/**
Default Humanloop provider instance.
 */
export const humanloop = createHumanloop();
