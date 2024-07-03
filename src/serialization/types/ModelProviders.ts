/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const ModelProviders: core.serialization.Schema<serializers.ModelProviders.Raw, Humanloop.ModelProviders> =
    core.serialization.enum_([
        "openai",
        "openai_azure",
        "ai21",
        "mock",
        "anthropic",
        "langchain",
        "cohere",
        "replicate",
        "google",
        "groq",
    ]);

export declare namespace ModelProviders {
    type Raw =
        | "openai"
        | "openai_azure"
        | "ai21"
        | "mock"
        | "anthropic"
        | "langchain"
        | "cohere"
        | "replicate"
        | "google"
        | "groq";
}
