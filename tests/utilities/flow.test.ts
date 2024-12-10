import { Tracer } from "@opentelemetry/sdk-trace-node";
import dotenv from "dotenv";
import { toolUtilityFactory } from "../../src/utilities/tool";
import { promptUtilityFactory } from "../../src/utilities/prompt";
import { flowUtilityFactory } from "../../src/utilities/flow";
import OpenAI from "openai";
import {
    callLLMMessages,
    openTelemetryMockedHLExporterConfiguration,
    openTelemetryTestConfiguration,
} from "./fixtures";
import { isLLMProviderCall } from "../../src/otel";
import { AsyncFunction } from "../../src/otel/constants";

function testScenario(opentelemetryTracer: Tracer): [AsyncFunction, AsyncFunction, AsyncFunction, AsyncFunction] {
    const randomString = toolUtilityFactory(
        opentelemetryTracer,
        () => {
            return Math.random().toString(36).substring(2, 14);
        },
        {
            function: {
                name: "randomString",
                description: "Generate a random 12-character alphanumeric string.",
                strict: true,
                parameters: {},
            },
        }
    );

    dotenv.config({
        path: __dirname + "/../../.env",
    });
    const callLLM = promptUtilityFactory(opentelemetryTracer, async (messages: any[]) => {
        const client = new OpenAI({ apiKey: process.env.OPENAI_KEY });
        const response = await client.chat.completions.create({
            model: "gpt-4o",
            messages: messages,
            temperature: 0.8,
        });
        return (response.choices[0].message.content || "") + " " + (await randomString());
    });

    const agentCall = flowUtilityFactory(opentelemetryTracer, async (messages: any[]) => {
        return await callLLM(messages);
    });

    const flowOverFlow = flowUtilityFactory(opentelemetryTracer, async (messages: any[]) => {
        return await agentCall(messages);
    });

    return [randomString, callLLM, agentCall, flowOverFlow];
}

describe("flow decorator", () => {
    it("should not create a trace without a flow", async () => {
        const [tracer, exporter] = openTelemetryTestConfiguration();

        const callLLM = testScenario(tracer)[1];

        await callLLM(callLLMMessages());

        const spans = exporter.getFinishedSpans();

        expect(spans.length).toBe(3);
        expect(isLLMProviderCall(spans[0])).toBe(true);
        expect(spans[1].attributes["humanloop.file_type"]).toBe("tool");
        expect(spans[2].attributes["humanloop.file_type"]).toBe("prompt");
    });

    it("should create a flow log", async () => {
        const [tracer, exporter] = openTelemetryTestConfiguration();

        const agentCall = testScenario(tracer)[2];

        await agentCall(callLLMMessages());

        const spans = exporter.getFinishedSpans();
        expect(spans.length).toBe(4);
        expect(isLLMProviderCall(spans[0])).toBe(true);
        expect(spans[1].attributes["humanloop.file_type"]).toBe("tool");
        expect(spans[2].attributes["humanloop.file_type"]).toBe("prompt");
        expect(spans[3].attributes["humanloop.file_type"]).toBe("flow");
        expect(spans[3].attributes["humanloop.log.inputs.messages"]).toEqual(callLLMMessages());
        expect(spans[0].parentSpanId).toBe(spans[2].spanContext().spanId);
        expect(spans[1].parentSpanId).toBe(spans[2].spanContext().spanId);
        expect(spans[2].parentSpanId).toBe(spans[3].spanContext().spanId);
    });

    it("should create two flow logs with flow in flow", async () => {
        const [tracer, exporter] = openTelemetryTestConfiguration();

        const flowOverFlow = testScenario(tracer)[3];

        await flowOverFlow(callLLMMessages());

        const spans = exporter.getFinishedSpans();
        expect(spans.length).toBe(5);
        expect(isLLMProviderCall(spans[0])).toBe(true);
        expect(spans[1].attributes["humanloop.file_type"]).toBe("tool");
        expect(spans[2].attributes["humanloop.file_type"]).toBe("prompt");
        expect(spans[3].attributes["humanloop.file_type"]).toBe("flow");
        expect(spans[4].attributes["humanloop.file_type"]).toBe("flow");
        expect(spans[4].attributes["humanloop.log.inputs.messages"]).toEqual(callLLMMessages());
        expect(spans[0].parentSpanId).toBe(spans[2].spanContext().spanId);
        expect(spans[1].parentSpanId).toBe(spans[2].spanContext().spanId);
        expect(spans[2].parentSpanId).toBe(spans[3].spanContext().spanId);
        expect(spans[3].parentSpanId).toBe(spans[4].spanContext().spanId);
    });

    it(
        "should export logs with mocked HL API",
        async () => {
            const [tracer, exporter, createPromptLogResponse, createToolLogResponse, createFlowLogResponse] =
                openTelemetryMockedHLExporterConfiguration();

            const flowOverFlow = testScenario(tracer)[3];

            await flowOverFlow(callLLMMessages());

            await exporter.shutdown();

            await new Promise((resolve) => setTimeout(resolve, 5000));

            expect(exporter.getExportedSpans().length).toBe(5);

            expect(createFlowLogResponse.mock.calls).toHaveLength(2);

            const argsInnerFlowLog = createFlowLogResponse.mock.calls[1];
            expect(argsInnerFlowLog[0].traceParentId).toBe("flow_log_0");

            expect(createPromptLogResponse.mock.calls).toHaveLength(1);
            expect(createPromptLogResponse.mock.calls[0][0].traceParentId).toBe("flow_log_1");

            expect(createToolLogResponse.mock.calls).toHaveLength(1);
        },
        10 * 1000
    );
});
