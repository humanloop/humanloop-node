/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * Supported model providers.
 */
export type ModelProviders =
    | "openai"
    | "openai_azure"
    | "mock"
    | "anthropic"
    | "bedrock"
    | "cohere"
    | "replicate"
    | "google"
    | "groq"
    | "deepseek";

export const ModelProviders = {
    Openai: "openai",
    OpenaiAzure: "openai_azure",
    Mock: "mock",
    Anthropic: "anthropic",
    Bedrock: "bedrock",
    Cohere: "cohere",
    Replicate: "replicate",
    Google: "google",
    Groq: "groq",
    Deepseek: "deepseek",
} as const;
