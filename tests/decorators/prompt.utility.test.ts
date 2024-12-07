import { Tracer } from "@opentelemetry/sdk-trace-node";
import { ModelProviders } from "../../src/api/types/ModelProviders";
import {
    callLLMMessages,
    openTelemetryHLProcessorTestConfiguration,
    openTelemetryTestConfiguration,
    tearDown,
} from "./fixtures";
import * as dotenv from "dotenv";

import { prompt, UtilityPromptKernel } from "../../src/decorators/prompt";
import OpenAI from "openai";
import { HUMANLOOP_FILE_KEY, isHumanloopSpan, readFromOpenTelemetrySpan } from "../../src/otel";
import { PromptKernelRequest } from "../../src/api/types/PromptKernelRequest";

const PROVIDER_AND_MODEL: [ModelProviders, string][] = [[ModelProviders.Openai, "gpt-4o"]];

function testScenario(opentelemetryTracer: Tracer, promptKernel?: UtilityPromptKernel) {
    dotenv.config({
        path: __dirname + "/../../.env",
    });
    async function callLLMBase(provider: ModelProviders, model: string, messages: any[]): Promise<string | null> {
        switch (provider) {
            case ModelProviders.Openai:
                const client = new OpenAI({ apiKey: process.env.OPENAI_KEY });
                const response = await client.chat.completions.create({
                    model: model,
                    messages: messages,
                    temperature: 0.8,
                });
                return response.choices[0].message.content;
            default:
                throw new Error(`Unsupported provider: ${provider}`);
        }
    }

    return prompt(opentelemetryTracer, callLLMBase, promptKernel, "Call LLM");
}

// LLM providers might not be available, retry if needed
jest.retryTimes(3);

describe("prompt decorator", () => {
    afterEach(tearDown);

    it.each(PROVIDER_AND_MODEL)("should work with provider %s and model %s", async (provider, model) => {
        const [tracer, exporter] = openTelemetryTestConfiguration();

        const callLLM = testScenario(tracer);

        await callLLM(provider, model, callLLMMessages());
        const spans = exporter.getFinishedSpans();
        expect(isHumanloopSpan(spans[0])).toBeFalsy();
        expect(isHumanloopSpan(spans[1])).toBeTruthy();
        expect(spans[1].attributes["prompt"]).toBeFalsy();
    });

    // it.each(PROVIDER_AND_MODEL)(
    //     "should enrich prompt span when using HLProcessor with provider %s and model %s",
    //     async (provider, model) => {
    //         const [tracer, exporter] = openTelemetryHLProcessorTestConfiguration();
    //         const callLLM = testScenario(tracer);

    //         await callLLM(provider, model, callLLMMessages());

    //         const spans = exporter.getFinishedSpans();
    //         expect(spans.length).toBe(2);

    //         expect(isHumanloopSpan(spans[0])).toBeFalsy();
    //         expect(isHumanloopSpan(spans[1])).toBeTruthy();

    //         const promptKernel = readFromOpenTelemetrySpan(spans[1], HUMANLOOP_FILE_KEY)
    //             .prompt as unknown as PromptKernelRequest;

    //         expect(promptKernel.temperature).toBe(0.8);
    //         expect(promptKernel.model).toBe(model);
    //         expect(promptKernel.provider).toBe(provider);
    //         expect(promptKernel.topP).toBeFalsy();
    //     }
    // );

    it.each(PROVIDER_AND_MODEL)(
        "should prefer overrides over inferred values for provider %s and model %s",
        async (provider, model) => {
            const [tracer, exporter] = openTelemetryHLProcessorTestConfiguration();

            const callLLM = testScenario(tracer, {
                temperature: 0.9,
                topP: 0.1,
                template: "You are an assistant on the following topics: {topics}.",
            });

            await callLLM(provider, model, callLLMMessages());

            expect(exporter.getFinishedSpans().length).toBe(2);

            const promptKernel = readFromOpenTelemetrySpan(exporter.getFinishedSpans()[1], HUMANLOOP_FILE_KEY)
                .prompt as unknown as PromptKernelRequest;

            expect(promptKernel.temperature).toBe(0.9);
            expect(promptKernel.topP).toBe(0.1);
            expect(promptKernel.model).toBe(model);
        }
    );

    it.each([
        [{ foo: "bar" }, { foo: "bar" }],
        [undefined, undefined],
    ])("should properly set attributes", async (test_attributes, expected_attributes_prompt) => {
        const [tracer, exporter] = openTelemetryHLProcessorTestConfiguration();

        const callLLM = testScenario(tracer, {
            attributes: test_attributes,
        });

        await callLLM(ModelProviders.Openai, "gpt-4o", callLLMMessages());

        expect(exporter.getFinishedSpans().length).toBe(2);

        const promptKernel = readFromOpenTelemetrySpan(exporter.getFinishedSpans()[1], HUMANLOOP_FILE_KEY)
            .prompt as unknown as PromptKernelRequest;

        expect(promptKernel.attributes).toStrictEqual(expected_attributes_prompt);
    });
});
