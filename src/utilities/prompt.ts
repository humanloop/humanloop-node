import { context, createContextKey } from "@opentelemetry/api";
import { ReadableSpan, Tracer } from "@opentelemetry/sdk-trace-node";

import { PromptKernelRequest } from "../api/types/PromptKernelRequest";
import { Humanloop } from "../index";
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

// Make model optional since it can be inferred by Instrumentors
export type UtilityPromptKernel =
    | (Omit<PromptKernelRequest, "model"> & {
          model?: string;
      })
    | (Omit<PromptKernelRequest, "model" | "provider"> & {
          // The user must specify both the provider and the model if they specify the model
          model: string;
          provider: Humanloop.ModelProviders;
      });

/**
 * Higher-order function for wrapping functions with OpenTelemetry spans
 * for "prompt" related operations.
 *
 * @param func - The function to wrap
 * @param opentelemetryTracer - The OpenTelemetry tracer instance
 * @param version - Additional metadata for the span
 * @param path - The span's path attribute
 * @returns Wrapped function with OpenTelemetry instrumentation
 */
export function promptUtilityFactory<I, M, O>(
    opentelemetryTracer: Tracer,
    func: InputsMessagesCallableType<I, M, O>,
    path: string,
    version?: UtilityPromptKernel,
): {
    (inputs: I, messages: M): O extends Promise<infer R> ? Promise<R> : Promise<O>;
    path: string;
    version: UtilityPromptKernel;
} {
    // @ts-ignore
    return async (inputs: I, messages: M) => {
        // Filter out undefined attributes
        if (version?.attributes) {
            version.attributes = Object.entries(version.attributes)
                .filter(([_, value]) => value !== undefined)
                .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
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
                          traceId: parentFlowMetadata.traceId,
                          isFlowLog: false,
                          traceParentId: parentSpanId,
                      }
                    : null;

            // Add span attributes
            span = span.setAttribute(HUMANLOOP_PATH_KEY, path || func.name);
            span = span.setAttribute(HUMANLOOP_FILE_TYPE_KEY, "prompt");
            span = span.setAttribute(HUMANLOOP_WRAPPED_FUNCTION_NAME, func.name);

            if (version) {
                writeToOpenTelemetrySpan(
                    span as unknown as ReadableSpan,
                    {
                        ...version,
                    } as unknown as NestedDict,
                    "humanloop.file.prompt",
                );
            }

            // Execute the wrapped function in a child context
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
                        // @ts-ignore
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

            const promptLog = {
                output: outputStringified,
                error,
                inputs: inputs,
                messages: messages,
            };

            writeToOpenTelemetrySpan(
                span as unknown as ReadableSpan,
                // @ts-ignore
                promptLog,
                HUMANLOOP_LOG_KEY,
            );

            span.end();

            return output;
        });
    };
}
