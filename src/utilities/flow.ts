import { context, createContextKey } from "@opentelemetry/api";
import { ReadableSpan, Tracer } from "@opentelemetry/sdk-trace-node";

import { FlowKernelRequest } from "../api/types/FlowKernelRequest";
import {
    HUMANLOOP_FILE_TYPE_KEY,
    HUMANLOOP_LOG_KEY,
    HUMANLOOP_PARENT_SPAN_CTX_KEY,
    HUMANLOOP_PATH_KEY,
    HUMANLOOP_TRACE_FLOW_CTX_KEY,
    HUMANLOOP_WRAPPED_FUNCTION_NAME,
    NestedDict,
    generateSpanId,
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
        return opentelemetryTracer.startActiveSpan(generateSpanId(), async (span) => {
            const ctx = context.active();
            const spanId = span.spanContext().spanId;
            const parentSpanId = ctx.getValue(parentSpanContextKey) as
                | string
                | undefined;
            const parentFlowMetadata = ctx.getValue(flowMetadataKey) as {
                traceId: string;
                isFlowLog: boolean;
                traceParentId: string;
            } | null;
            // Handle trace flow context
            const flowMetadata =
                parentSpanId && parentFlowMetadata
                    ? {
                          traceId: spanId,
                          isFlowLog: true,
                          traceParentId: parentSpanId,
                      }
                    : {
                          traceId: spanId,
                          traceParentId: null,
                          isFlowLog: true,
                      };

            // Add span attributes
            span = span.setAttribute(HUMANLOOP_PATH_KEY, path || func.name);
            span = span.setAttribute(HUMANLOOP_FILE_TYPE_KEY, "flow");
            span = span.setAttribute(HUMANLOOP_WRAPPED_FUNCTION_NAME, func.name);

            if (version) {
                writeToOpenTelemetrySpan(
                    span as unknown as ReadableSpan,
                    version as unknown as NestedDict,
                    "humanloop.file.flow",
                );
            }

            const { output, error } = await context.with(
                ctx
                    .setValue(parentSpanContextKey, spanId)
                    .setValue(flowMetadataKey, flowMetadata),
                async () => {
                    let output: O | null;
                    let error: string | null = null;
                    try {
                        output = await func(inputs, messages);
                    } catch (err: any) {
                        console.error(`Error calling ${func.name}:`, err);
                        output = null;
                        error = err.message || String(err);
                    }
                    return {
                        output,
                        error,
                    };
                },
            );

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
