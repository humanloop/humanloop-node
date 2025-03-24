import {
    LanguageModelV1,
    LanguageModelV1CallWarning,
    LanguageModelV1FinishReason,
    LanguageModelV1ProviderMetadata,
    LanguageModelV1StreamPart
} from "@ai-sdk/provider";
import {
    FetchFunction,
    ParseResult,
    combineHeaders,
    createEventSourceResponseHandler,
    createJsonResponseHandler,
    generateId, postJsonToApi
} from "@ai-sdk/provider-utils";
import { z } from "zod";

import { convertToHumanloopChatMessages } from "./convert-to-humanloop-chat-messages";
import { getResponseMetadata } from "./get-response-metadata";
import { HumanloopGenerateArgs } from "./humanloop-api-types";
import { HumanloopChatModelId, HumanloopChatSettings } from "./humanloop-chat-settings";
import {
    HumanloopErrorData, humanloopFailedResponseHandler
} from "./humanloop-error";
import { prepareTools } from "./humanloop-prepare-tools";
import { mapHumanloopFinishReason } from "./map-humanloop-finish-reason";
import { HumanloopProviderMetadata } from "./humanloop-provider";
import path = require("path");

type HumanloopChatConfig = {
    provider: string;
    headers: () => Record<string, string | undefined>;
    url: (options: { path: string }) => string;
    fetch?: FetchFunction;
};

export class HumanloopChatLanguageModel implements LanguageModelV1 {
    readonly specificationVersion = "v1";

    readonly supportsStructuredOutputs = false;
    readonly defaultObjectGenerationMode = "json";

    readonly modelId: HumanloopChatModelId;
    readonly settings: HumanloopChatSettings;

    private readonly config: HumanloopChatConfig;

    constructor(
        modelId: HumanloopChatModelId,
        settings: HumanloopChatSettings,
        config: HumanloopChatConfig,
    ) {
        this.modelId = modelId;
        this.settings = settings;
        this.config = config;
    }

    get provider(): string {
        return this.config.provider;
    }

    get supportsImageUrls(): boolean {
        // image urls can be sent if downloadImages is disabled (default):
        // return !this.settings.downloadImages;
        // TODO should this be true?
        return true;
    }

    private getArgs({
        mode,
        prompt,
        maxTokens,
        temperature,
        topP,
        topK,
        frequencyPenalty,
        presencePenalty,
        stopSequences,
        responseFormat,
        seed,
        stream,
        providerMetadata,
    }: Parameters<LanguageModelV1["doGenerate"]>[0] & {
        stream: boolean;
    }): { args: HumanloopGenerateArgs; warnings: LanguageModelV1CallWarning[] } {
        const type = mode.type;

        const warnings: LanguageModelV1CallWarning[] = [];

        if (topK != null) {
            warnings.push({
                type: "unsupported-setting",
                setting: "topK",
            });
        }

        const { path, id, prompt: promptProviderMetadata, ...restProviderMetadata } = (providerMetadata?.humanloop as HumanloopProviderMetadata) ?? {};

        if (!path && !id) {
            throw new Error("One of path or id is required in providerMetadata.humanloop.")
        }

        // prompt hyperparameters:
        const promptArgs: HumanloopGenerateArgs["prompt"] = {
            ...(promptProviderMetadata ?? {}),
            model: this.modelId,
            maxTokens,
            temperature,
            topP,
            frequencyPenalty,
            presencePenalty,
            stop: stopSequences,
            seed,

            // TODO: is response format supported for streaming?
            responseFormat:
                stream === false && responseFormat?.type === "json"
                    ? {
                          type: "json_object",
                          jsonSchema: responseFormat?.schema as
                              | Record<string, unknown>
                              | undefined,
                      }
                    : undefined,
        };

        // TODO Can we allow empty messages? With prompt.call you should be able to only pass inputs.
        const messages = convertToHumanloopChatMessages(prompt);
        const callArgs: Partial<HumanloopGenerateArgs> = {
            user: this.settings.user, // overridden by providerMetadata if passed at the function level
            ...restProviderMetadata,
            path,
            id,
            messages,
        };

        switch (type) {
            case "regular": {
                const { tools, toolChoice, toolWarnings } = prepareTools({
                    tools: mode.tools,
                    toolChoice: mode.toolChoice,
                });
                return {
                    args: {
                        ...callArgs,
                        prompt: {
                            ...promptArgs,
                            tools,
                        },
                        toolChoice,
                    },
                    warnings: [...warnings, ...toolWarnings],
                };
            }

            case "object-json": {
                return {
                    args: {
                        ...callArgs,
                        prompt: {
                            ...promptArgs,
                            // json object response format is not supported for streaming:
                            responseFormat:
                                stream === false
                                    ? {
                                          type: "json_object",
                                          jsonSchema: mode.schema as
                                              | Record<string, unknown>
                                              | undefined,
                                      }
                                    : undefined,
                        },
                    },
                    warnings,
                };
            }

            case "object-tool": {
                return {
                    args: {
                        ...callArgs,
                        prompt: {
                            ...promptArgs,
                            tools: [
                                {
                                    name: mode.tool.name,
                                    description: mode.tool.description,
                                    parameters: mode.tool.parameters as Record<
                                        string,
                                        unknown
                                    >,
                                },
                            ],
                        },
                        toolChoice: {
                            type: "function",
                            function: { name: mode.tool.name },
                        },
                    },
                    warnings,
                };
            }

            default: {
                const _exhaustiveCheck: never = type;
                throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
            }
        }
    }

    async doGenerate(
        options: Parameters<LanguageModelV1["doGenerate"]>[0],
    ): Promise<Awaited<ReturnType<LanguageModelV1["doGenerate"]>>> {
        const { args, warnings } = this.getArgs({ ...options, stream: false });

        const body = JSON.stringify(args);

        const {
            responseHeaders,
            value: response,
            rawValue: rawResponse,
        } = await postJsonToApi({
            url: this.config.url({
                path: "/prompts/call",
            }),
            headers: combineHeaders(this.config.headers(), options.headers),
            body: args,
            failedResponseHandler: humanloopFailedResponseHandler,
            successfulResponseHandler: createJsonResponseHandler(
                humanloopChatResponseSchema,
            ),
            abortSignal: options.abortSignal,
            fetch: this.config.fetch,
        });

        const { messages: rawPrompt, ...rawSettings } = args;
        const log = response.logs[0];

        // TODO: Should we sum these? I think it might be better to have usage
        // at the top level return instead of on each sample?
        const promptTokens = response.logs.some((l) => l.promptTokens)
            ? response.logs.reduce((s, l) => s + (l.promptTokens ?? 0), 0)
            : NaN;
        const completionTokens = response.logs.some((l) => l.outputTokens)
            ? response.logs.reduce((s, l) => s + (l.outputTokens ?? 0), 0)
            : NaN;

        return {
            text: log.output ?? undefined,
            toolCalls: log.outputMessage.toolCalls?.map((toolCall) => ({
                toolCallType: "function",
                toolCallId: toolCall.id ?? generateId(),
                toolName: toolCall.function.name,
                args: toolCall.function.arguments || "",
            })),
            finishReason: mapHumanloopFinishReason(log.finishReason),
            usage: {
                promptTokens,
                completionTokens,
            },
            rawCall: { rawPrompt, rawSettings },
            rawResponse: { headers: responseHeaders, body: rawResponse },
            response: getResponseMetadata(response),
            warnings,
            request: { body },
        };
    }

    async doStream(
        options: Parameters<LanguageModelV1["doStream"]>[0],
    ): Promise<Awaited<ReturnType<LanguageModelV1["doStream"]>>> {
        const { args, warnings } = this.getArgs({ ...options, stream: true });

        const body = JSON.stringify({ ...args, stream: true });

        const { responseHeaders, value: response } = await postJsonToApi({
            url: this.config.url({
                path: "/prompts/call",
            }),
            headers: combineHeaders(this.config.headers(), options.headers),
            body: args,
            failedResponseHandler: humanloopFailedResponseHandler,
            successfulResponseHandler: createEventSourceResponseHandler(
                humanloopChatChunkSchema,
            ),
            abortSignal: options.abortSignal,
            fetch: this.config.fetch,
        });

        const { messages: rawPrompt, ...rawSettings } = args;

        const toolCalls: Array<{
            id: string;
            type: "function";
            function: {
                name: string;
                arguments: string;
            };
            hasFinished: boolean;
        }> = [];

        let finishReason: LanguageModelV1FinishReason = "unknown";
        let usage: {
            promptTokens: number | undefined;
            completionTokens: number | undefined;
        } = {
            promptTokens: undefined,
            completionTokens: undefined,
        };
        let isFirstChunk = true;

        let providerMetadata: LanguageModelV1ProviderMetadata | undefined;
        return {
            stream: response.pipeThrough(
                new TransformStream<
                    ParseResult<z.infer<typeof humanloopChatChunkSchema>>,
                    LanguageModelV1StreamPart
                >({
                    transform(chunk, controller) {
                        // handle failed chunk parsing / validation:
                        if (chunk.success == false) {
                            finishReason = "error";
                            controller.enqueue({ type: "error", error: chunk.error });
                            return;
                        }

                        // handle error chunks:
                        if (!("id" in chunk.value)) {
                            finishReason = "error";
                            controller.enqueue({ type: "error", error: (chunk.value as HumanloopErrorData).message });
                            return;
                        }


                        const value: z.infer<typeof humanloopChatChunkSchema> = chunk.value;

                        if (isFirstChunk) {
                            isFirstChunk = false;

                            controller.enqueue({
                                type: "response-metadata",
                                ...getResponseMetadata({
                                    id: value.id,
                                    // no modelId or createdAt on stream response
                                }),
                            });
                        }

                        if (value.finishReason != null) {
                            finishReason = mapHumanloopFinishReason(value.finishReason);
                        }

                        // TODO handle outputMessage
                        if (value.output != null) {
                            controller.enqueue({
                                type: "text-delta",
                                textDelta: value.output,
                            });
                        }

                        // TODO: confused -- don't see any tool calls/requests in prompts call response
                    //     if (delta.tool_calls != null) {
                    //         for (const toolCallDelta of delta.tool_calls) {
                    //             const index = toolCallDelta.index;

                    //             if (toolCalls[index] == null) {
                    //                 if (toolCallDelta.type !== "function") {
                    //                     throw new InvalidResponseDataError({
                    //                         data: toolCallDelta,
                    //                         message: `Expected 'function' type.`,
                    //                     });
                    //                 }

                    //                 if (toolCallDelta.id == null) {
                    //                     throw new InvalidResponseDataError({
                    //                         data: toolCallDelta,
                    //                         message: `Expected 'id' to be a string.`,
                    //                     });
                    //                 }

                    //                 if (toolCallDelta.function?.name == null) {
                    //                     throw new InvalidResponseDataError({
                    //                         data: toolCallDelta,
                    //                         message: `Expected 'function.name' to be a string.`,
                    //                     });
                    //                 }

                    //                 toolCalls[index] = {
                    //                     id: toolCallDelta.id,
                    //                     type: "function",
                    //                     function: {
                    //                         name: toolCallDelta.function.name,
                    //                         arguments:
                    //                             toolCallDelta.function.arguments ?? "",
                    //                     },
                    //                     hasFinished: false,
                    //                 };

                    //                 const toolCall = toolCalls[index];

                    //                 if (
                    //                     toolCall.function?.name != null &&
                    //                     toolCall.function?.arguments != null
                    //                 ) {
                    //                     // send delta if the argument text has already started:
                    //                     if (toolCall.function.arguments.length > 0) {
                    //                         controller.enqueue({
                    //                             type: "tool-call-delta",
                    //                             toolCallType: "function",
                    //                             toolCallId: toolCall.id,
                    //                             toolName: toolCall.function.name,
                    //                             argsTextDelta:
                    //                                 toolCall.function.arguments,
                    //                         });
                    //                     }

                    //                     // check if tool call is complete
                    //                     // (some providers send the full tool call in one chunk):
                    //                     if (
                    //                         isParsableJson(toolCall.function.arguments)
                    //                     ) {
                    //                         controller.enqueue({
                    //                             type: "tool-call",
                    //                             toolCallType: "function",
                    //                             toolCallId: toolCall.id ?? generateId(),
                    //                             toolName: toolCall.function.name,
                    //                             args: toolCall.function.arguments,
                    //                         });
                    //                         toolCall.hasFinished = true;
                    //                     }
                    //                 }

                    //                 continue;
                    //             }

                    //             // existing tool call, merge if not finished
                    //             const toolCall = toolCalls[index];

                    //             if (toolCall.hasFinished) {
                    //                 continue;
                    //             }

                    //             if (toolCallDelta.function?.arguments != null) {
                    //                 toolCall.function!.arguments +=
                    //                     toolCallDelta.function?.arguments ?? "";
                    //             }

                    //             // send delta
                    //             controller.enqueue({
                    //                 type: "tool-call-delta",
                    //                 toolCallType: "function",
                    //                 toolCallId: toolCall.id,
                    //                 toolName: toolCall.function.name,
                    //                 argsTextDelta:
                    //                     toolCallDelta.function.arguments ?? "",
                    //             });

                    //             // check if tool call is complete
                    //             if (
                    //                 toolCall.function?.name != null &&
                    //                 toolCall.function?.arguments != null &&
                    //                 isParsableJson(toolCall.function.arguments)
                    //             ) {
                    //                 controller.enqueue({
                    //                     type: "tool-call",
                    //                     toolCallType: "function",
                    //                     toolCallId: toolCall.id ?? generateId(),
                    //                     toolName: toolCall.function.name,
                    //                     args: toolCall.function.arguments,
                    //                 });
                    //                 toolCall.hasFinished = true;
                    //             }
                    //         }
                    //     }
                    },

                    flush(controller) {
                        controller.enqueue({
                            type: "finish",
                            finishReason,
                            usage: {
                                promptTokens: usage.promptTokens ?? NaN,
                                completionTokens: usage.completionTokens ?? NaN,
                            },
                            ...(providerMetadata != null ? { providerMetadata } : {}),
                        });
                    },
                }),
            ),
            rawCall: { rawPrompt, rawSettings },
            rawResponse: { headers: responseHeaders },
            warnings,
            request: { body },
        };
    }
}

// limited version of the schema, focussed on what is needed for the implementation
// this approach limits breakages when the API changes and increases efficiency
const humanloopChatMessageSchema = z
    .object({
        name: z.string().nullish(),
        toolCallId: z.string().nullish(),
        role: z.literal("assistant"),
        content: z
            .union([
                z.string(),
                z.array(
                    z.union([
                        z.object({
                            type: z.literal("text"),
                            text: z.string(),
                        }),
                        z.object({
                            type: z.literal("image_url"),
                            imageUrl: z.object({
                                url: z.string(),
                                detail: z.union([
                                    z.literal("high"),
                                    z.literal("low"),
                                    z.literal("auto"),
                                ]),
                            }),
                        }),
                    ]),
                ),
            ])
            .nullish(),
        toolCalls: z
            .array(
                z.object({
                    id: z.string().nullish(),
                    type: z.literal("function"),
                    function: z.object({
                        name: z.string(),
                        arguments: z.string().nullish(),
                    }),
                }),
            )
            .nullish(),
    })
const humanloopChatResponseSchema = z.object({
    id: z.string(),
    traceId: z.string().nullish(),
    startTime: z.date().nullish(),
    endTime: z.date().nullish(),
    prompt: z.object({
        id: z.string(),
        versionId: z.string(),
    }),
    logs: z.array(
        z.object({
            output: z.string().nullish(),
            createdAt: z.date().nullish(),
            error: z.string().nullish(),
            outputMessage: humanloopChatMessageSchema.nullish(),
            finishReason: z.string().nullish(),
            index: z.number(),
            providerLatency: z.number().nullish(),
            promptTokens: z.number().nullish(),
            reasoningTokens: z.number().nullish(),
            outputTokens: z.number().nullish(),
            promptCost: z.number().nullish(),
            outputCost: z.number().nullish(),
        }),
    ),
});

// limited version of the schema, focussed on what is needed for the implementation
// this approach limits breakages when the API changes and increases efficiency
const humanloopChatChunkSchema = z.union([
    z.object({
        id: z.string(),
        index: z.number(),
        promptId: z.string(),
        versionId: z.string(),
        output: z.string().nullish(),
        outputMessage: humanloopChatMessageSchema.nullish(),
        finishReason: z.string().nullish(),
    }),
    z.object({
        error: z.string(),
    }),
]);
