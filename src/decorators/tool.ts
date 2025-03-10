import { ReadableSpan, Tracer } from "@opentelemetry/sdk-trace-node";

import { ToolKernelRequest } from "../api/types/ToolKernelRequest";
import { getEvaluationContext, getTraceId } from "../context";
import { File as EvalRunFile } from "../evals/types";
import { NestedDict, jsonifyIfNotString, writeToOpenTelemetrySpan } from "../otel";
import {
    HUMANLOOP_FILE_KEY,
    HUMANLOOP_FILE_TYPE_KEY,
    HUMANLOOP_LOG_KEY,
    HUMANLOOP_PATH_KEY,
    HUMANLOOP_TOOL_SPAN_NAME,
} from "../otel/constants";

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
    callable: (inputs: I) => O,
    version: ToolKernelRequest,
    path: string,
): (inputs: I) => O & {
    jsonSchema: Record<string, unknown>;
    file: EvalRunFile<I, O>;
} {
    const fileType = "tool";

    const wrappedFunction = async (inputs: I) => {
        const evaluationContext = getEvaluationContext();
        if (evaluationContext && evaluationContext.path === path) {
            throw new Error(
                "Tools cannot be evaluated with the `evaluations.run()` utility.",
            );
        }

        validateArgumentsAgainstSchema(version, inputs);

        // @ts-ignore
        return opentelemetryTracer.startActiveSpan(
            HUMANLOOP_TOOL_SPAN_NAME,
            async (span) => {
                // Add span attributes
                writeToOpenTelemetrySpan(
                    span as unknown as ReadableSpan,
                    {
                        ...version,
                    } as unknown as NestedDict,
                    HUMANLOOP_FILE_KEY,
                );
                span = span.setAttribute(HUMANLOOP_FILE_TYPE_KEY, fileType);
                span = span.setAttribute(HUMANLOOP_PATH_KEY, path);

                let logInputs = { ...inputs } as Record<string, unknown>;
                let logError: string | undefined;
                let logOutput: string | undefined;

                let funcOutput: O | undefined;
                try {
                    funcOutput = await callable(inputs);
                    logOutput = jsonifyIfNotString(callable, funcOutput);
                    logError = undefined;
                } catch (err: any) {
                    console.error(`Error calling ${callable.name}:`, err);
                    funcOutput = undefined;
                    logOutput = undefined;
                    logError = err.message || String(err);
                }

                const toolLog = {
                    inputs: logInputs,
                    output: logOutput,
                    error: logError,
                    trace_parent_id: getTraceId(),
                };
                writeToOpenTelemetrySpan(
                    span as unknown as ReadableSpan,
                    toolLog as unknown as NestedDict,
                    HUMANLOOP_LOG_KEY,
                );

                span.end();
                return funcOutput;
            },
        );
    };

    // @ts-ignore Adding jsonSchema property to utility-wrapped function
    return Object.assign(wrappedFunction, {
        jsonSchema: version.function || {},
        decorator: {
            type: fileType,
            path: path,
            version,
        },
    });
}

function validateArgumentsAgainstSchema(toolKernel: ToolKernelRequest, inputs?: any) {
    const parameters =
        (toolKernel.function?.parameters?.properties as Record<any, unknown>) || {};

    if (!parameters || Object.keys(parameters).length === 0) {
        if (inputs === undefined) {
            return;
        }
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
