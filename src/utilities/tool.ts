import { context, createContextKey } from "@opentelemetry/api";
import { ReadableSpan, Tracer } from "@opentelemetry/sdk-trace-node";

import { ToolKernelRequest } from "../api/types/ToolKernelRequest";
import {
    NestedDict,
    generateSpanId,
    jsonifyIfNotString,
    writeToOpenTelemetrySpan,
} from "../otel";
import {
    HUMANLOOP_FILE_KEY,
    HUMANLOOP_FILE_TYPE_KEY,
    HUMANLOOP_LOG_KEY,
    HUMANLOOP_META_FUNCTION_NAME,
    HUMANLOOP_PARENT_SPAN_CTX_KEY,
    HUMANLOOP_PATH_KEY,
    HUMANLOOP_TRACE_FLOW_CTX_KEY,
} from "../otel/constants";
import { ToolCallableType } from "./types";

/**
 * Higher-order function for wrapping a function with OpenTelemetry instrumentation.
 * It inspects the argument signature of the wrapped function to build a JSON schema.
 *
 * @param func - The function to wrap
 * @param opentelemetryTracer - The OpenTelemetry tracer instance
 * @param path - Optional span path
 * @param version - Additional metadata for the function
 * @returns Wrapped function with OpenTelemetry instrumentation
 */
export function toolUtilityFactory<I, O>(
    opentelemetryTracer: Tracer,
    func: ToolCallableType<I, O>,
    version: ToolKernelRequest,
    path?: string,
): {
    (args?: I): O extends Promise<infer R> ? Promise<R> : Promise<O>;
    jsonSchema: Record<string, any>;
} {
    // Attach JSON schema metadata to the function for external use
    if (version) {
        (func as any).jsonSchema = version.function || {};
    }

    const wrappedFunction = async (
        inputs: I,
        // @ts-ignore
    ): O extends Promise<infer R> ? Promise<R> : Promise<O> => {
        validateArgumentsAgainstSchema(version, inputs);

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
            span.setAttribute(HUMANLOOP_PATH_KEY, path || func.name);
            span.setAttribute(HUMANLOOP_FILE_TYPE_KEY, "tool");
            span = span.setAttribute(HUMANLOOP_META_FUNCTION_NAME, func.name);

            // @ts-ignore
            // Execute the wrapped function in the appropriate context
            const { output, error } = await context.with(
                ctx
                    .setValue(parentSpanContextKey, spanId)
                    .setValue(flowMetadataKey, flowMetadata),
                async () => {
                    let output: O | null;
                    let error: string | null = null;

                    try {
                        output = await func(inputs);
                    } catch (err: any) {
                        console.error(`Error calling ${func.name}:`, err);
                        output = null;
                        error = err.message || String(err);
                    }

                    return { output, error };
                },
            );

            const outputStringified = jsonifyIfNotString(func, output);

            const toolLog = {
                inputs: inputs,
                output: outputStringified,
                error,
            };

            writeToOpenTelemetrySpan(
                span as unknown as ReadableSpan,
                toolLog as unknown as NestedDict,
                HUMANLOOP_LOG_KEY,
            );

            writeToOpenTelemetrySpan(
                span as unknown as ReadableSpan,
                {
                    ...version,
                } as unknown as NestedDict,
                `${HUMANLOOP_FILE_KEY}.tool`,
            );

            span.end();
            return output;
        });
    };

    // @ts-ignore Adding jsonSchema property to utility-wrapped function
    return Object.assign(wrappedFunction, {
        jsonSchema: (func as any).jsonSchema,
    });
}

function validateArgumentsAgainstSchema(toolKernel: ToolKernelRequest, inputs?: any) {
    const parameters =
        (toolKernel.function?.parameters?.properties as Record<any, unknown>) || {};

    if (!parameters || Object.keys(parameters).length === 0) {
        if (inputs === undefined) {
            return;
        }
        console.log("BAI", parameters);
        throw new Error(
            `Tool function ${toolKernel.function?.name} received inputs when the JSON schema defines none`,
        );
    }

    if (inputs === undefined) {
        if (Object.keys(parameters).length > 0 || !parameters) {
            throw new Error(
                `Tool function ${toolKernel.function?.name} expected inputs but received none.`,
            );
        }
    }

    Object.keys(inputs!).forEach((inputKey) => {
        if (!parameters.hasOwnProperty(inputKey)) {
            throw new Error(`Inputs key '${inputKey}' does not match the JSON schema.`);
        }
    });
}
