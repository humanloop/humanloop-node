import * as anthropic from "@anthropic-ai/sdk";
import * as cohere from "cohere-ai";
import {
    InMemorySpanExporter,
    NodeTracerProvider,
    SimpleSpanProcessor,
    Tracer,
} from "@opentelemetry/sdk-trace-node";
import { AnthropicInstrumentation } from "@traceloop/instrumentation-anthropic";
import { CohereInstrumentation } from "@traceloop/instrumentation-cohere";
import { OpenAIInstrumentation } from "@traceloop/instrumentation-openai";
import openai from "openai";

import {
    CreateFlowLogResponse,
    CreatePromptLogResponse,
    CreateToolLogResponse,
} from "../../src/api";
import { HumanloopClient } from "../../src/humanloop.client";
import { HumanloopSpanExporter } from "../../src/otel/exporter";
import { HumanloopSpanProcessor } from "../../src/otel/processor";

export function getFixtures() {
    return TEST_FIXTURES;
}

let TEST_FIXTURES: {
    callLLMMessages?: object[];
} = {};

export function callLLMMessages() {
    return [
        {
            role: "system",
            content:
                "You are an assistant on the following topics: greetings in foreign languages.",
        },
        {
            role: "user",
            content: "Bonjour!",
        },
    ];
}

export function openTelemetryTestConfiguration(): [Tracer, InMemorySpanExporter] {
    const exporter = new InMemorySpanExporter();
    const processor = new SimpleSpanProcessor(exporter);

    const provider = new NodeTracerProvider({
        spanProcessors: [processor],
    });

    const instrumentors = [
        new OpenAIInstrumentation({
            enrichTokens: true,
        }),
        new AnthropicInstrumentation(),
        new CohereInstrumentation(),
    ];
    (instrumentors[0] as OpenAIInstrumentation).manuallyInstrument(openai);
    (instrumentors[1] as AnthropicInstrumentation).manuallyInstrument(anthropic);
    (instrumentors[2] as CohereInstrumentation).manuallyInstrument(cohere);
    for (const instrumentor of instrumentors) {
        instrumentor.setTracerProvider(provider);
        instrumentor.enable();
    }

    provider.register();

    const tracer = provider.getTracer("test");

    return [tracer, exporter];
}

export function openTelemetryHLProcessorTestConfiguration(): [
    Tracer,
    InMemorySpanExporter,
] {
    const exporter = new InMemorySpanExporter();
    const processor = new HumanloopSpanProcessor(exporter);

    const provider = new NodeTracerProvider({
        spanProcessors: [processor],
    });

    const instrumentors = [
        new OpenAIInstrumentation({
            enrichTokens: true,
        }),
        new AnthropicInstrumentation(),
        new CohereInstrumentation(),
    ];
    (instrumentors[0] as OpenAIInstrumentation).manuallyInstrument(openai);
    (instrumentors[1] as AnthropicInstrumentation).manuallyInstrument(anthropic);
    (instrumentors[2] as CohereInstrumentation).manuallyInstrument(cohere);
    for (const instrumentor of instrumentors) {
        instrumentor.setTracerProvider(provider);
        instrumentor.enable();
    }

    provider.register();

    return [provider.getTracer("test"), exporter];
}

export function openTelemetryMockedHLExporterConfiguration(): [
    Tracer,
    HumanloopSpanExporter,
    jest.Mock<Promise<CreatePromptLogResponse>>,
    jest.Mock<Promise<CreateToolLogResponse>>,
    jest.Mock<Promise<CreateFlowLogResponse>>,
] {
    const client = new HumanloopClient({
        apiKey: "test",
    });
    const promptLog = jest.fn();
    promptLog.mockReturnValueOnce(Promise.resolve({ id: "prompt_log_0" }));
    client.prompts.log = promptLog;

    const toolLog = jest.fn();
    toolLog.mockReturnValueOnce(Promise.resolve({ id: "tool_log_0" }));
    client.tools.log = toolLog;

    const flowLog = jest.fn();
    flowLog
        .mockReturnValueOnce(Promise.resolve({ id: "flow_log_0" }))
        .mockReturnValueOnce(Promise.resolve({ id: "flow_log_1" }));
    client.flows.log = flowLog;

    const exporter = new HumanloopSpanExporter(client);
    const processor = new HumanloopSpanProcessor(exporter);

    const provider = new NodeTracerProvider({
        spanProcessors: [processor],
    });

    const instrumentors = [
        new OpenAIInstrumentation({
            enrichTokens: true,
        }),
        new AnthropicInstrumentation(),
        new CohereInstrumentation(),
    ];
    (instrumentors[0] as OpenAIInstrumentation).manuallyInstrument(openai);
    (instrumentors[1] as AnthropicInstrumentation).manuallyInstrument(anthropic);
    (instrumentors[2] as CohereInstrumentation).manuallyInstrument(cohere);
    for (const instrumentor of instrumentors) {
        instrumentor.setTracerProvider(provider);
        instrumentor.enable();
    }

    provider.register();

    // @ts-ignore
    return [provider.getTracer("test"), exporter, promptLog, toolLog, flowLog];
}
