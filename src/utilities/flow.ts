import { context, createContextKey } from "@opentelemetry/api";
import { ReadableSpan } from "@opentelemetry/sdk-trace-node";
import { Tracer } from "@opentelemetry/sdk-trace-node";
import {
    generateSpanId,
    HUMANLOOP_FILE_TYPE_KEY,
    HUMANLOOP_LOG_KEY,
    HUMANLOOP_PATH_KEY,
    HUMANLOOP_TRACE_FLOW_CTX_KEY,
    jsonifyIfNotString,
    writeToOpenTelemetrySpan,
} from "../otel"; // Define or import similar helpers
import { argsToInputs } from "./helpers";
import { HUMANLOOP_PARENT_SPAN_CTX_KEY, NestedDict } from "../otel"; // Define or import constants and context structures
import { FlowKernelRequest } from "api/types/FlowKernelRequest";

export function flowUtilityFactory<T extends (...args: any[]) => any>(
    opentelemetryTracer: Tracer,
    func: T,
    flowKernel?: FlowKernelRequest,
    path?: string
): (...args: any[]) => Promise<ReturnType<T>> {
    const wrappedFunction = async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
        // Filter out undefined attributes
        if (flowKernel?.attributes) {
            flowKernel.attributes = Object.fromEntries(
                Object.entries(flowKernel.attributes || {}).filter(([_, v]) => v !== undefined)
            );
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

            if (flowKernel) {
                writeToOpenTelemetrySpan(
                    span as unknown as ReadableSpan,
                    flowKernel as unknown as NestedDict,
                    "humanloop.file.flow"
                );
            }

            const inputs = argsToInputs(func, args);

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

            const flowLog = {
                inputs,
                output: outputStringified,
                error,
            };

            writeToOpenTelemetrySpan(span as unknown as ReadableSpan, flowLog as NestedDict, HUMANLOOP_LOG_KEY);

            span.end();
            return output;
        });
    };

    return wrappedFunction as T;
}
