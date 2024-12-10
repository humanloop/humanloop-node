import { context, createContextKey } from "@opentelemetry/api";
import { ReadableSpan, Tracer } from "@opentelemetry/sdk-trace-node";
import { argsToInputs } from "./helpers";
import { writeToOpenTelemetrySpan, generateSpanId, jsonifyIfNotString, NestedDict } from "../otel";
import {
    HUMANLOOP_PATH_KEY,
    HUMANLOOP_FILE_TYPE_KEY,
    HUMANLOOP_LOG_KEY,
    HUMANLOOP_PARENT_SPAN_CTX_KEY,
    HUMANLOOP_TRACE_FLOW_CTX_KEY,
} from "../otel/constants";
import { ToolKernelRequest } from "../api/types/ToolKernelRequest";

/**
 * Higher-order function for wrapping a function with OpenTelemetry instrumentation.
 * It inspects the argument signature of the wrapped function to build a JSON schema.
 *
 * @param func - The function to wrap
 * @param opentelemetryTracer - The OpenTelemetry tracer instance
 * @param path - Optional span path
 * @param toolKernel - Additional metadata for the function
 * @returns Wrapped function with OpenTelemetry instrumentation
 */
export function toolUtilityFactory<T extends (...args: any[]) => any>(
    opentelemetryTracer: Tracer,
    func: T,
    toolKernel: ToolKernelRequest,
    path?: string
): { (...args: any[]): Promise<ReturnType<T>>; jsonSchema: Record<string, any> } {
    // Attach JSON schema metadata to the function for external use
    if (toolKernel) {
        (func as any).jsonSchema = toolKernel.function || {};
    }

    const wrappedFunction = async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
        validateArgumentsAgainstSchema(func, args, toolKernel);

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
            span.setAttribute(HUMANLOOP_PATH_KEY, path || func.name);
            span.setAttribute(HUMANLOOP_FILE_TYPE_KEY, "tool");

            const inputs = argsToInputs(func, args);

            // Execute the wrapped function in the appropriate context
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

                    return { output, error };
                }
            );

            const outputStringified = jsonifyIfNotString(func, output);

            const toolLog = {
                inputs,
                output: outputStringified,
                error,
            };

            writeToOpenTelemetrySpan(
                span as unknown as ReadableSpan,
                toolLog as unknown as NestedDict,
                HUMANLOOP_LOG_KEY
            );

            span.end();
            return output;
        });
    };

    // @ts-ignore Adding jsonSchema property to utility-wrapped function
    return Object.assign(wrappedFunction, { jsonSchema: (func as any).jsonSchema });
}

function computeOriginalArguments(originalFunc: Function): null | string[] {
    const stringified: string = originalFunc.toString();
    const startBracket = stringified.indexOf("(");
    if (startBracket < 0) {
        return null;
    }
    const endBracket = stringified.indexOf(")", startBracket);
    if (endBracket < 0) {
        return null;
    }
    const paramsString = stringified.substring(startBracket + 1, endBracket);
    if (paramsString.length === 0) {
        return [];
    }
    const params = paramsString.split(",").map((e) => e.trim());
    return params;
}

function validateArgumentsAgainstSchema(func: (...args: any[]) => any[], args: any[], toolKernel: ToolKernelRequest) {
    const funcArgumentNames = computeOriginalArguments(func);
    if (!funcArgumentNames || funcArgumentNames.length === 0) {
        return;
    }

    const parameters = toolKernel.function?.parameters?.properties as {};

    if (!parameters || Object.keys(parameters).length === 0) {
        return;
    }

    funcArgumentNames.forEach((argName) => {
        if (!parameters.hasOwnProperty(argName)) {
            throw new Error(`Function argument '${argName}' does not match the provided parameters.`);
        }
    });
}
