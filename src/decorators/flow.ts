import { Tracer } from "@opentelemetry/api";
import { ReadableSpan } from "@opentelemetry/sdk-trace-node";

import { HumanloopClient } from "../Client";
import { ChatMessage, FlowLogRequest, FlowLogResponse } from "../api";
import { HL_CONTEXT, getTraceId, setDecoratorContext, setTraceId } from "../context";
import { jsonifyIfNotString, writeToOpenTelemetrySpan } from "../otel";
import {
    HUMANLOOP_FILE_TYPE_KEY,
    HUMANLOOP_FLOW_SPAN_NAME,
    HUMANLOOP_LOG_KEY,
    HUMANLOOP_PATH_KEY,
} from "../otel/constants";

export function flowUtilityFactory<I, O>(
    client: HumanloopClient,
    opentelemetryTracer: Tracer,
    callable: (
        args: I extends Record<string, unknown> & {
            messages?: ChatMessage[];
        }
            ? I
            : never,
    ) => O,
    path: string,
    attributes?: Record<string, unknown>,
): (args: I) => Promise<O | undefined> & {
    file: {
        type: string;
        version: { attributes?: Record<string, unknown> };
        callable: (args: I) => Promise<O | undefined>;
    };
} {
    const flowKernel = { attributes: attributes || {} };
    const fileType = "flow";

    const wrappedFunction = async (
        inputs: I extends Record<string, unknown> & {
            messages?: ChatMessage[];
        }
            ? I
            : never,
    ) => {
        return HL_CONTEXT.with(
            setDecoratorContext({
                path: path,
                type: fileType,
                version: flowKernel,
            }),
            async () => {
                return opentelemetryTracer.startActiveSpan(
                    HUMANLOOP_FLOW_SPAN_NAME,
                    async (span) => {
                        span.setAttribute(HUMANLOOP_PATH_KEY, path);
                        span.setAttribute(HUMANLOOP_FILE_TYPE_KEY, fileType);
                        const traceId = getTraceId();

                        const logInputs = { ...inputs } as Record<string, unknown>;
                        const logMessages = logInputs.messages as
                            | ChatMessage[]
                            | undefined;
                        delete logInputs.messages;

                        const initLogInputs: FlowLogRequest = {
                            inputs: logInputs,
                            messages: logMessages,
                            traceParentId: traceId,
                        };

                        const flowLogResponse: FlowLogResponse =
                            // @ts-ignore
                            await client.flows._log({
                                path,
                                flow: flowKernel,
                                logStatus: "incomplete",
                                ...initLogInputs,
                            });

                        return await HL_CONTEXT.with(
                            setTraceId(flowLogResponse.id),
                            async () => {
                                let logOutput: string | undefined;
                                let outputMessage: ChatMessage | undefined;
                                let logError: string | undefined;
                                let funcOutput: O | undefined;

                                try {
                                    funcOutput = await callable(inputs);
                                    if (
                                        // @ts-ignore
                                        funcOutput instanceof Object &&
                                        "role" in funcOutput &&
                                        "content" in funcOutput
                                    ) {
                                        outputMessage =
                                            funcOutput as unknown as ChatMessage;
                                        logOutput = undefined;
                                    } else {
                                        logOutput = jsonifyIfNotString(
                                            callable,
                                            funcOutput,
                                        );
                                        outputMessage = undefined;
                                    }
                                    logError = undefined;
                                } catch (err: any) {
                                    console.error(
                                        `Error calling ${callable.name}:`,
                                        err,
                                    );
                                    logOutput = undefined;
                                    outputMessage = undefined;
                                    logError = err.message || String(err);
                                    funcOutput = undefined as unknown as O;
                                }

                                const updatedFlowLog = {
                                    log_status: "complete",
                                    output: logOutput,
                                    error: logError,
                                    output_message: outputMessage,
                                    id: flowLogResponse.id,
                                };

                                writeToOpenTelemetrySpan(
                                    span as unknown as ReadableSpan,
                                    // @ts-ignore
                                    updatedFlowLog,
                                    HUMANLOOP_LOG_KEY,
                                );

                                span.end();
                                return funcOutput;
                            },
                        );
                    },
                );
            },
        );
    };

    // @ts-ignore
    return Object.assign(wrappedFunction, {
        file: {
            path: path,
            type: fileType,
            version: flowKernel,
            callable: wrappedFunction,
        },
    });
}
