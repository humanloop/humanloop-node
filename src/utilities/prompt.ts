import { ReadableSpan, Tracer } from "@opentelemetry/sdk-trace-node";

import { PromptKernelRequest } from "../api/types/PromptKernelRequest";
import { Humanloop } from "../index";
import {
    HUMANLOOP_FILE_TYPE_KEY,
    HUMANLOOP_LOG_KEY,
    HUMANLOOP_META_FUNCTION_NAME,
    HUMANLOOP_PATH_KEY,
    HUMANLOOP_PROMPT_SPAN_NAME,
    NestedDict,
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

        // @ts-ignore
        return opentelemetryTracer.startActiveSpan(
            HUMANLOOP_PROMPT_SPAN_NAME,
            async (span) => {
                // Add span attributes
                span = span.setAttribute(HUMANLOOP_PATH_KEY, path || func.name);
                span = span.setAttribute(HUMANLOOP_FILE_TYPE_KEY, "prompt");
                span = span.setAttribute(HUMANLOOP_META_FUNCTION_NAME, func.name);

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
                let output: O | null;
                let error: string | null = null;
                try {
                    output = await func(inputs, messages);
                } catch (err: any) {
                    console.error(`Error calling ${func.name}:`, err);
                    output = null;
                    error = err.message || String(err);
                }

                const promptLog = {
                    output: jsonifyIfNotString(func, output),
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
            },
        );
    };
}
