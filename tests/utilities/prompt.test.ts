import * as dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
import { MessageParam } from "@anthropic-ai/sdk/resources/messages";
import { Tracer } from "@opentelemetry/sdk-trace-node";
import { CohereClient } from "cohere-ai";
import { Message as CohereMessage } from "cohere-ai/api";
import OpenAI from "openai";

import { ModelProviders } from "../../src/api/types/ModelProviders";
import { PromptKernelRequest } from "../../src/api/types/PromptKernelRequest";
import {
    HUMANLOOP_FILE_KEY,
    isHumanloopSpan,
    readFromOpenTelemetrySpan,
} from "../../src/otel";
import {
    UtilityPromptKernel,
    promptUtilityFactory,
} from "../../src/utilities/prompt";
import {
    callLLMMessages,
    openTelemetryHLProcessorTestConfiguration,
    openTelemetryTestConfiguration,
} from "./fixtures";

// NOTE: Add here as more Providers are added
const PROVIDER_AND_MODEL: [ModelProviders, string][] = [
    [ModelProviders.Openai, "gpt-4o"],
    [ModelProviders.Anthropic, "claude-3-opus-latest"],
    [ModelProviders.Cohere, "command"],
];

function testScenario(
    opentelemetryTracer: Tracer,
    promptKernel?: UtilityPromptKernel,
) {
    dotenv.config({
        path: __dirname + "/../../.env",
    });
    // NOTE: Add here as more Providers are added
    ["OPENAI_KEY", "ANTHROPIC_KEY", "COHERE_KEY"].forEach((key) => {
        if (!process.env[key]) {
            throw new Error(
                `Missing ${key} in environment. Have you added it inside .env?`,
            );
        }
    });
    async function callLLMBase(
        provider: ModelProviders,
        model: string,
        messages: { role: "system" | "user" | "assistant"; content: string }[],
    ): Promise<string | null> {
        switch (provider) {
            case ModelProviders.Openai:
                const openAIClient = new OpenAI({
                    apiKey: process.env.OPENAI_KEY,
                });
                const openAIResponse =
                    await openAIClient.chat.completions.create({
                        model: model,
                        messages: messages,
                        temperature: 0.8,
                    });
                return openAIResponse.choices[0].message.content;
            case ModelProviders.Anthropic:
                const anthropicClient = new Anthropic({
                    apiKey: process.env.ANTHROPIC_KEY,
                });
                const anthropicResponse = await anthropicClient.messages.create(
                    {
                        model: model,
                        system: messages[0].content,
                        temperature: 0.8,
                        messages: messages.slice(1).map((m) => {
                            return {
                                role: m.role,
                                content: m.content,
                            } as MessageParam;
                        }),
                        max_tokens: 500,
                    },
                );
                return anthropicResponse.content
                    .map((c) => {
                        if ("text" in c) {
                            return c.text;
                        }
                        return "";
                    })
                    .join("");
            case ModelProviders.Cohere:
                const cohereClient = new CohereClient({
                    token: process.env.COHERE_KEY,
                });
                const chat = await cohereClient.chat({
                    temperature: 0.8,
                    model: model,
                    // The system message/ template
                    preamble: messages[0].content,
                    chatHistory: messages.slice(1, -1).map((message) => {
                        return {
                            message: message.content,
                            role:
                                message.role === "user" ? "USER" : "ASSISTANT",
                        };
                    }) as CohereMessage[],
                    message: messages[messages.length - 1].content,
                });
                return chat.text;
            default:
                throw new Error(`Unsupported provider: ${provider}`);
        }
    }

    return promptUtilityFactory(
        opentelemetryTracer,
        callLLMBase,
        promptKernel,
        "Call LLM",
    );
}

// LLM providers might not be available, retry if needed
jest.retryTimes(3);

describe("prompt decorator", () => {
    it.each(PROVIDER_AND_MODEL)(
        "should work with provider %s and model %s",
        async (provider, model) => {
            const [tracer, exporter] = openTelemetryTestConfiguration();

            const callLLM = testScenario(tracer);

            await callLLM(provider, model, callLLMMessages());
            const spans = exporter.getFinishedSpans();
            expect(spans.length).toBe(2);
            expect(isHumanloopSpan(spans[0])).toBeFalsy();
            expect(isHumanloopSpan(spans[1])).toBeTruthy();
            expect(spans[1].attributes["prompt"]).toBeFalsy();
        },
        PROVIDER_AND_MODEL.length * 5 * 1000,
    );

    it.each(PROVIDER_AND_MODEL)(
        "should enrich prompt span when using HLProcessor with provider %s and model %s",
        async (provider, model) => {
            const [tracer, exporter] =
                openTelemetryHLProcessorTestConfiguration();
            const callLLM = testScenario(tracer);

            await callLLM(provider, model, callLLMMessages());

            const spans = exporter.getFinishedSpans();
            expect(spans.length).toBe(2);

            expect(isHumanloopSpan(spans[0])).toBeFalsy();
            expect(isHumanloopSpan(spans[1])).toBeTruthy();

            const promptKernel = readFromOpenTelemetrySpan(
                spans[1],
                HUMANLOOP_FILE_KEY,
            ).prompt as unknown as PromptKernelRequest;

            expect(promptKernel.temperature).toBe(0.8);
            expect(promptKernel.model).toBe(model);
            expect(promptKernel.provider).toBe(provider);
            expect(promptKernel.topP).toBeFalsy();
        },
        PROVIDER_AND_MODEL.length * 5 * 1000,
    );

    it.each(PROVIDER_AND_MODEL)(
        "should prefer overrides over inferred values for provider %s and model %s",
        async (provider, model) => {
            const [tracer, exporter] =
                openTelemetryHLProcessorTestConfiguration();

            const callLLM = testScenario(tracer, {
                temperature: 0.9,
                topP: 0.1,
                template:
                    "You are an assistant on the following topics: {topics}.",
            });

            await callLLM(provider, model, callLLMMessages());

            expect(exporter.getFinishedSpans().length).toBe(2);

            const promptKernel = readFromOpenTelemetrySpan(
                exporter.getFinishedSpans()[1],
                HUMANLOOP_FILE_KEY,
            ).prompt as unknown as PromptKernelRequest;

            expect(promptKernel.temperature).toBe(0.9);
            expect(promptKernel.topP).toBe(0.1);
            expect(promptKernel.model).toBe(model);
        },
        PROVIDER_AND_MODEL.length * 5 * 1000,
    );

    it.each([
        [{ foo: "bar" }, { foo: "bar" }],
        [undefined, undefined],
    ])(
        "should properly set attributes",
        async (test_attributes, expected_attributes_prompt) => {
            const [tracer, exporter] =
                openTelemetryHLProcessorTestConfiguration();

            const callLLM = testScenario(tracer, {
                attributes: test_attributes,
            });

            await callLLM(ModelProviders.Openai, "gpt-4o", callLLMMessages());

            expect(exporter.getFinishedSpans().length).toBe(2);

            const promptKernel = readFromOpenTelemetrySpan(
                exporter.getFinishedSpans()[1],
                HUMANLOOP_FILE_KEY,
            ).prompt as unknown as PromptKernelRequest;

            expect(promptKernel.attributes).toStrictEqual(
                expected_attributes_prompt,
            );
        },
    );
});
