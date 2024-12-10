import { context, createContextKey } from "@opentelemetry/api";
import { ReadableSpan, Tracer } from "@opentelemetry/sdk-trace-node";
import { PromptKernelRequest } from "../api/types/PromptKernelRequest";
import {
    generateSpanId,
    HUMANLOOP_FILE_TYPE_KEY,
    HUMANLOOP_LOG_KEY,
    HUMANLOOP_PARENT_SPAN_CTX_KEY,
    HUMANLOOP_PATH_KEY,
    HUMANLOOP_TRACE_FLOW_CTX_KEY,
    jsonifyIfNotString,
    NestedDict,
    writeToOpenTelemetrySpan,
} from "../otel";
import { argsToInputs } from "./helpers";

export type UtilityPromptKernel = Omit<PromptKernelRequest, "model"> & {
    model?: string;
};

/**
 * Higher-order function for wrapping functions with OpenTelemetry spans
 * for "prompt" related operations.
 *
 * @param func - The function to wrap
 * @param opentelemetryTracer - The OpenTelemetry tracer instance
 * @param promptKernel - Additional metadata for the span
 * @param path - The span's path attribute
 * @returns Wrapped function with OpenTelemetry instrumentation
 */
export function promptUtilityFactory<T extends (...args: any[]) => any>(
    opentelemetryTracer: Tracer,
    func: T,
    promptKernel?: UtilityPromptKernel,
    path?: string
): (...args: any[]) => Promise<ReturnType<T>> {
    const wrappedFunction = async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
        // Filter out undefined attributes
        if (promptKernel?.attributes) {
            promptKernel.attributes = Object.entries(promptKernel.attributes)
                .filter(([_, value]) => value !== undefined)
                .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
        }

        const parentSpanContextKey = createContextKey(HUMANLOOP_PARENT_SPAN_CTX_KEY);
        const flowMetadataKey = createContextKey(HUMANLOOP_TRACE_FLOW_CTX_KEY);

        return opentelemetryTracer.startActiveSpan(generateSpanId(), async (span) => {
            const ctx = context.active();
            const spanId = span.spanContext().spanId;
            const parentSpanId = ctx.getValue(parentSpanContextKey) as string | undefined;
            const parentFlowMetadata = ctx.getValue(flowMetadataKey) as {
                traceId: string;
                isFlowLog: boolean;
                traceParentId: string;
            } | null;

            // Handle trace flow context

            const flowMetadata =
                parentSpanId && parentFlowMetadata
                    ? {
                          traceId: parentFlowMetadata.traceId,
                          isFlowLog: false,
                          traceParentId: parentSpanId,
                      }
                    : null;

            // Add span attributes
            span = span.setAttribute(HUMANLOOP_PATH_KEY, path || func.name);
            span = span.setAttribute(HUMANLOOP_FILE_TYPE_KEY, "prompt");

            if (promptKernel) {
                writeToOpenTelemetrySpan(
                    span as unknown as ReadableSpan,
                    {
                        ...promptKernel,
                    } as unknown as NestedDict,
                    "humanloop.file.prompt"
                );
            }

            const inputs = argsToInputs(func, args);

            // Execute the wrapped function in a child context
            const { output, error } = await context.with(
                ctx.setValue(parentSpanContextKey, spanId).setValue(flowMetadataKey, flowMetadata),
                async () => {
                    let output: ReturnType<T> | null;
                    let error: string | null = null;

                    try {
                        output = await func(...args);
                    } catch (err: any) {
                        console.error(`Error calling ${func.name}:`, err);
                        output = null;
                        error = err.message || String(err);
                    }

                    return {
                        output,
                        error,
                    };
                }
            );

            const outputStringified = jsonifyIfNotString(func, output);

            const promptLog = {
                inputs,
                output: outputStringified,
                error,
            };

            writeToOpenTelemetrySpan(span as unknown as ReadableSpan, promptLog as NestedDict, HUMANLOOP_LOG_KEY);

            span.end();

            return output;
        });
    };

    return wrappedFunction as T;
}
