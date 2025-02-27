import * as contextApi from "@opentelemetry/api";
import { ReadableSpan, Tracer } from "@opentelemetry/sdk-trace-node";
import { ChatMessage, FlowLogRequest } from "api";
import { object } from "core/schemas";
import { getTraceId, setTraceId } from "eval_utils";

import * as BaseHumanloopClient from "../Client";
import { FlowKernelRequest } from "../api/types/FlowKernelRequest";
import {
    HUMANLOOP_FILE_TYPE_KEY,
    HUMANLOOP_FLOW_SPAN_NAME,
    HUMANLOOP_LOG_KEY,
    HUMANLOOP_PATH_KEY,
    jsonifyIfNotString,
    writeToOpenTelemetrySpan,
} from "../otel";

export function flowUtilityFactory<I, O>(
    client: BaseHumanloopClient.HumanloopClient,
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
    attributes = attributes || {};
    const fileType = "flow";

    const wrappedFunction = async (
        inputs: I extends Record<string, unknown> & {
            messages?: ChatMessage[];
        }
            ? I
            : never,
    ) => {
        return opentelemetryTracer.startActiveSpan(
            HUMANLOOP_FLOW_SPAN_NAME,
            async (span) => {
                span = span.setAttribute(HUMANLOOP_PATH_KEY, path);
                const traceId = getTraceId();

                let logMessages: ChatMessage[] | undefined = undefined;
                let logInputs = { ...inputs } as Record<string, unknown>;
                // @ts-ignore
                if (inputs && "messages" in inputs) {
                    logMessages = inputs.messages as ChatMessage[];
                    delete logInputs.messages;
                }

                const flowLogRequest: FlowLogRequest = {
                    messages: logMessages,
                    inputs: logInputs,
                    traceParentId: traceId,
                };

                const flowLogResponse = await client.flows.log({
                    path,
                    flow: {
                        attributes,
                    },
                    logStatus: "incomplete",
                    ...flowLogRequest,
                });

                return await contextApi.context.with(
                    setTraceId(flowLogResponse.id),
                    async () => {
                        span = span.setAttribute(HUMANLOOP_PATH_KEY, path);
                        span = span.setAttribute(HUMANLOOP_FILE_TYPE_KEY, fileType);

                        let logOutput: string | undefined;
                        let outputMessage: ChatMessage | undefined;
                        let logError: string | undefined;
                        let funcOutput: O;
                        try {
                            funcOutput = await callable(inputs);
                            if (
                                funcOutput instanceof object &&
                                Object.keys(funcOutput).length == 2 &&
                                "role" in (funcOutput as object) &&
                                "content" in (funcOutput as object)
                            ) {
                                outputMessage = funcOutput as unknown as ChatMessage;
                                logOutput = undefined;
                            } else {
                                logOutput = jsonifyIfNotString(callable, funcOutput);
                                outputMessage = undefined;
                            }
                            logError = undefined;
                        } catch (err: any) {
                            console.error(`Error calling ${callable.name}:`, err);
                            logOutput = undefined;
                            logMessages = undefined;
                            logError = err.message || String(err);
                            funcOutput = undefined as unknown as O;
                        }

                        const flowLog = {
                            output: logOutput,
                            outputMessage: outputMessage,
                            inputs: logInputs,
                            messages: logMessages,
                            error: logError,
                            id: flowLogResponse.id,
                            log_status: "complete",
                        };

                        writeToOpenTelemetrySpan(
                            span as unknown as ReadableSpan,
                            // @ts-ignore
                            flowLog,
                            HUMANLOOP_LOG_KEY,
                        );

                        span.end();
                        return funcOutput;
                    },
                );
            },
        );
    };

    // @ts-ignore
    return Object.assign(wrappedFunction, {
        file: {
            type: fileType,
            version: { attributes },
            callable: wrappedFunction,
            path: path,
        },
    });
}
