import { InMemorySpanExporter, NodeTracerProvider, SimpleSpanProcessor, Tracer } from "@opentelemetry/sdk-trace-node";
import { OpenAIInstrumentation } from "@traceloop/instrumentation-openai";
import { HumanloopSpanProcessor } from "../../src/otel/processor";
import { HumanloopSpanExporter } from "../../src/otel/exporter";
import { HumanloopClient } from "../../src/Client";
import openai from "openai";
import { CreateFlowLogResponse, CreatePromptLogResponse, CreateToolLogResponse } from "../../src/api";

export function getFixtures() {
    return TEST_FIXTURES;
}

// Is set inside openTelemetryTestConfiguration
let unregisterInstrumentationsCallback: (() => void) | null = null;

export function tearDown() {
    if (unregisterInstrumentationsCallback) {
        unregisterInstrumentationsCallback();
    }
}

let TEST_FIXTURES: {
    callLLMMessages?: object[];
} = {};

export function callLLMMessages() {
    return [
        {
            role: "system",
            content: "You are an assistant on the following topics: greetings in foreign languages.",
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
    ];
    instrumentors[0].manuallyInstrument(openai);
    for (const instrumentor of instrumentors) {
        instrumentor.setTracerProvider(provider);
        instrumentor.enable();
    }

    provider.register();

    return [provider.getTracer("test"), exporter];
}

export function openTelemetryHLProcessorTestConfiguration(): [Tracer, InMemorySpanExporter] {
    const exporter = new InMemorySpanExporter();
    const processor = new HumanloopSpanProcessor(exporter);

    const provider = new NodeTracerProvider({
        spanProcessors: [processor],
    });

    const instrumentors = [
        new OpenAIInstrumentation({
            enrichTokens: true,
        }),
    ];
    instrumentors[0].manuallyInstrument(openai);
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
    jest.Mock<Promise<CreateFlowLogResponse>>
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
    ];
    instrumentors[0].manuallyInstrument(openai);
    for (const instrumentor of instrumentors) {
        instrumentor.setTracerProvider(provider);
        instrumentor.enable();
    }

    provider.register();

    // @ts-ignore
    return [provider.getTracer("test"), exporter, promptLog, toolLog, flowLog];
}
