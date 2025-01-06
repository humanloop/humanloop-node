import { context, createContextKey } from "@opentelemetry/api";
import { ReadableSpan, Tracer } from "@opentelemetry/sdk-trace-node";

import { FlowKernelRequest } from "../api/types/FlowKernelRequest";
import {
    HUMANLOOP_FILE_TYPE_KEY,
    HUMANLOOP_LOG_KEY,
    HUMANLOOP_META_FUNCTION_NAME,
    HUMANLOOP_PARENT_SPAN_CTX_KEY,
    HUMANLOOP_PATH_KEY,
    HUMANLOOP_TRACE_FLOW_CTX_KEY,
    NestedDict,
    jsonifyIfNotString,
    writeToOpenTelemetrySpan,
} from "../otel";
import { InputsMessagesCallableType } from "./types";

export function flowUtilityFactory<I, M, O>(
    opentelemetryTracer: Tracer,
    func: InputsMessagesCallableType<I, M, O>,
    path: string,
    version?: FlowKernelRequest,
): {
    (inputs: I, messages: M): O extends Promise<infer R> ? Promise<R> : Promise<O>;
    path: string;
    version: FlowKernelRequest;
} {
    const wrappedFunction = async (inputs: I, messages: M) => {
        // Filter out undefined attributes
        if (version?.attributes) {
            version.attributes = Object.fromEntries(
                Object.entries(version.attributes || {}).filter(
                    ([_, v]) => v !== undefined,
                ),
            );
        }

        const parentSpanContextKey = createContextKey(HUMANLOOP_PARENT_SPAN_CTX_KEY);
        const flowMetadataKey = createContextKey(HUMANLOOP_TRACE_FLOW_CTX_KEY);
        // @ts-ignore
        return opentelemetryTracer.startActiveSpan("humanloop.flow", async (span) => {
            const ctx = context.active();
            const spanId = span.spanContext().spanId;

            // Add span attributes
            span = span.setAttribute(HUMANLOOP_PATH_KEY, path || func.name);
            span = span.setAttribute(HUMANLOOP_FILE_TYPE_KEY, "flow");
            span = span.setAttribute(HUMANLOOP_META_FUNCTION_NAME, func.name);

            if (version) {
                writeToOpenTelemetrySpan(
                    span as unknown as ReadableSpan,
                    version as unknown as NestedDict,
                    "humanloop.file.flow",
                );
            }

            let output: O | null;
            let error: string | null = null;
            try {
                output = await func(inputs, messages);
            } catch (err: any) {
                console.error(`Error calling ${func.name}:`, err);
                output = null;
                error = err.message || String(err);
            }

            const outputStringified = jsonifyIfNotString(func, output);

            const flowLog = {
                output: outputStringified,
                inputs: inputs,
                messages: messages,
                error,
            };

            writeToOpenTelemetrySpan(
                span as unknown as ReadableSpan,
                // @ts-ignore
                flowLog,
                HUMANLOOP_LOG_KEY,
            );

            span.end();
            return output;
        });
    };

    // @ts-ignore
    return Object.assign(wrappedFunction, {
        path,
        version: version || { attributes: {} },
    });
}
