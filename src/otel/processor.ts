import { Context } from "@opentelemetry/api";
import { ExportResult, ExportResultCode } from "@opentelemetry/core";
import {
    ReadableSpan,
    Span,
    SpanExporter,
    SpanProcessor,
} from "@opentelemetry/sdk-trace-node";
import { SpanAttributes as AiSemanticConventions } from "@traceloop/ai-semantic-conventions";

import { ModelEndpoints, ModelProviders } from "../api";
import { PromptKernelRequest } from "../api/types/PromptKernelRequest";
import {
    HUMANLOOP_FILE_KEY,
    HUMANLOOP_FILE_TYPE_KEY,
    HUMANLOOP_FLOW_SPAN_NAME,
    HUMANLOOP_LOG_KEY,
    HUMANLOOP_META_FUNCTION_NAME,
} from "./constants";
import {
    NestedDict,
    isHumanloopSpan,
    isLLMProviderCall,
    readFromOpenTelemetrySpan,
    writeToOpenTelemetrySpan,
} from "./helpers";

// Interface for waiting on child spans to complete
interface CompletableSpan {
    span: ReadableSpan;
    complete: boolean;
}

/**
 * Enriches Humanloop spans with data from their child spans.
 */
export class HumanloopSpanProcessor implements SpanProcessor {
    private spanExporter: SpanExporter;
    private children: Map<string, CompletableSpan[]>;
    // List of all span IDs that are contained in a Flow trace
    // They are passed to the Exporter as a span attribute
    // so the Exporter knows when to complete a trace
    private prerequisites: Map<string, string[]>;

    constructor(exporter: SpanExporter) {
        this.spanExporter = exporter;
        this.children = new Map();
        this.prerequisites = new Map();
    }

    async forceFlush(): Promise<void> {}

    onStart(span: Span, _: Context): void {
        const spanId = span.spanContext().spanId;
        const parentSpanId = span.parentSpanId;
        if (span.name === HUMANLOOP_FLOW_SPAN_NAME) {
            this.prerequisites.set(spanId, []);
        }
        if (parentSpanId !== undefined && isHumanloopSpan(span)) {
            for (const [traceHead, allTraceNodes] of this.prerequisites) {
                if (
                    parentSpanId === traceHead ||
                    allTraceNodes.includes(parentSpanId)
                ) {
                    allTraceNodes.push(spanId);
                    this.prerequisites.set(traceHead, allTraceNodes);
                    break;
                }
            }
        }
        // Handle stream case: when Prompt instrumented function calls a provider with streaming: true
        // The instrumentor span will end only when the ChunksResponse is consumed, which can happen
        // after the span created by the Prompt utility finishes. To handle this, we register all instrumentor
        // spans belonging to a Humanloop span, and their parent will wait for them to complete in onEnd before
        // exporting the Humanloop span.
        if (span.parentSpanId !== undefined && this.isInstrumentorSpan(span)) {
            this.children.set(span.parentSpanId, [
                ...(this.children.get(span.parentSpanId) || []),
                { span, complete: false },
            ]);
        }
    }

    async shutdown(): Promise<void> {}

    /**
     * Handles spans at the end of their lifecycle. Enriches Humanloop spans and send both HL and
     * non-HL spans to the exporter.
     */
    onEnd(span: ReadableSpan): void {
        if (isHumanloopSpan(span)) {
            // Wait for children to complete asynchronously
            new Promise<void>((resolve) => {
                const checkChildrenSpans = () => {
                    const childrenSpans = this.children.get(span.spanContext().spanId);
                    if (
                        (childrenSpans || []).every((childSpan) => childSpan.complete)
                    ) {
                        resolve();
                    } else {
                        setTimeout(checkChildrenSpans, 100);
                    }
                };
                checkChildrenSpans();
            }).then((_) => {
                // All instrumentor spans have arrived, we can process the
                // Humanloop parent span owning them
                if (span.name === HUMANLOOP_FLOW_SPAN_NAME) {
                    // If the span if a Flow Log, add attribute with all span IDs it
                    // needs to wait before completion
                    writeToOpenTelemetrySpan(
                        span,
                        this.prerequisites.get(span.spanContext().spanId) || [],
                        HUMANLOOP_LOG_KEY,
                    );
                    this.prerequisites.delete(span.spanContext().spanId);
                }

                this.processSpanDispatch(
                    span,
                    this.children.get(span.spanContext().spanId) || [],
                );

                // Release references
                this.children.delete(span.spanContext().spanId);

                // Pass Humanloop span to Exporter
                this.spanExporter.export([span], (result: ExportResult) => {
                    if (result.code !== ExportResultCode.SUCCESS) {
                        console.error("Failed to export span:", result.error);
                    }
                });
            });
        } else if (span.parentSpanId !== undefined && this.isInstrumentorSpan(span)) {
            // If this is one of the children spans waited upon, update its completion status

            // Type checks
            const childrenSpans = this.children.get(span.parentSpanId);
            if (
                childrenSpans === undefined ||
                !childrenSpans.some(
                    (childSpan) =>
                        childSpan.span.spanContext().spanId ===
                        span.spanContext().spanId,
                )
            ) {
                throw new Error(
                    `Internal error: Expected instrumentor span ${span.parentSpanId} to be already present in the list`,
                );
            }

            // Updating the child span status
            this.children.set(
                span.parentSpanId,
                childrenSpans.map((childSpan) =>
                    childSpan.span.spanContext().spanId === span.spanContext().spanId
                        ? {
                              // The child span will have extra information when it's marked
                              // as finished and sent to Processors.onEnd
                              span: span,
                              //   Marked as completed
                              complete: true,
                          }
                        : childSpan,
                ),
            );

            // Export the instrumentor span
            this.spanExporter.export([span], (result: ExportResult) => {
                if (result.code !== ExportResultCode.SUCCESS) {
                    console.error("Failed to export span:", result.error);
                }
            });
        } else {
            // Unknown span, export as it is
            this.spanExporter.export([span], (result: ExportResult) => {
                if (result.code !== ExportResultCode.SUCCESS) {
                    console.error("Failed to export span:", result.error);
                }
            });
        }
    }

    /**
     * Determines if a span is created by an instrumentor of interest.
     */
    private isInstrumentorSpan(span: ReadableSpan): boolean {
        // Expand in the future with checks for non-Prompt Files
        return isLLMProviderCall(span);
    }

    /**
     * Processes spans based on their type and enriches them if applicable.
     */
    private processSpanDispatch(
        span: ReadableSpan,
        childrenSpans: CompletableSpan[],
    ): void {
        const fileType = span.attributes[HUMANLOOP_FILE_TYPE_KEY];

        // Common processing for all Humanloop spans
        if (span.startTime) {
            span.attributes[`${HUMANLOOP_LOG_KEY}.startTime`] = span.startTime;
        }
        if (span.endTime) {
            span.attributes[`${HUMANLOOP_LOG_KEY}.endTime`] = span.endTime;
            span.attributes[`${HUMANLOOP_LOG_KEY}.createdAt`] = span.endTime;
        }

        switch (fileType) {
            case "prompt":
                this.processPrompt(
                    span,
                    childrenSpans.map((span) => span.span),
                );
                break;
            case "tool":
            case "flow":
                // Placeholder for processing other file types
                break;
            default:
                console.error("Unknown Humanloop File span", span);
        }
    }

    /**
     * Processes and enriches spans of type "prompt".
     */
    private processPrompt(
        promptSpan: ReadableSpan,
        childrenSpans: ReadableSpan[],
    ): void {
        if (childrenSpans.length === 0) {
            const hlFile =
                readFromOpenTelemetrySpan(promptSpan, HUMANLOOP_FILE_KEY) || {};
            const prompt = (hlFile.prompt || {}) as unknown as PromptKernelRequest;
            if (!("model" in prompt) || !prompt.model) {
                const functionName =
                    promptSpan.attributes[HUMANLOOP_META_FUNCTION_NAME];
                throw Error(
                    `Error in ${functionName}: the LLM provider and model could not be inferred. Call one of the supported providers in your prompt function definition or define them in the promptKernel argument of the prompt() function wrapper.`,
                );
            }
        }

        for (const childSpan of childrenSpans) {
            if (isLLMProviderCall(childSpan)) {
                this.enrichPromptKernel(promptSpan, childSpan);
                this.enrichPromptLog(promptSpan, childSpan);
                break; // Only process the first LLM provider call
            }
        }
    }

    /**
     * Enriches the prompt kernel of a prompt span using information from a child span.
     */
    private enrichPromptKernel(
        promptSpan: ReadableSpan,
        llmProviderCallSpan: ReadableSpan,
    ): void {
        const hlFile = readFromOpenTelemetrySpan(promptSpan, HUMANLOOP_FILE_KEY) || {};

        const prompt = (hlFile.prompt || {}) as unknown as PromptKernelRequest;

        // Assign or infer values for the prompt kernel
        prompt.model =
            prompt.model ||
            (llmProviderCallSpan.attributes[
                AiSemanticConventions.LLM_REQUEST_MODEL
            ] as string);
        if (prompt.model === undefined) {
            throw new Error(
                "Could not infer required parameter `model`. Please provide it in the prompt kernel.",
            );
        }
        prompt.endpoint =
            prompt.endpoint ||
            (llmProviderCallSpan.attributes[
                AiSemanticConventions.LLM_REQUEST_TYPE
            ] as ModelEndpoints);
        prompt.provider =
            prompt.provider ||
            ((
                llmProviderCallSpan.attributes[
                    AiSemanticConventions.LLM_SYSTEM
                ] as string
            ).toLowerCase() as ModelProviders);
        prompt.temperature =
            prompt.temperature ||
            (llmProviderCallSpan.attributes[
                AiSemanticConventions.LLM_REQUEST_TEMPERATURE
            ] as number);
        prompt.topP =
            prompt.topP ||
            (llmProviderCallSpan.attributes[
                AiSemanticConventions.LLM_REQUEST_TOP_P
            ] as number);
        prompt.maxTokens =
            prompt.maxTokens ||
            (llmProviderCallSpan.attributes[
                AiSemanticConventions.LLM_REQUEST_MAX_TOKENS
            ] as number);
        prompt.frequencyPenalty =
            prompt.frequencyPenalty ||
            (llmProviderCallSpan.attributes[
                AiSemanticConventions.LLM_FREQUENCY_PENALTY
            ] as number);
        prompt.tools = prompt.tools || [];

        // Write the enriched prompt kernel back to the span
        writeToOpenTelemetrySpan(
            promptSpan,
            prompt as unknown as NestedDict,
            `${HUMANLOOP_FILE_KEY}.prompt`,
        );
    }

    /**
     * Enriches the prompt log of a prompt span using information from a child span.
     */
    private enrichPromptLog(
        promptSpan: ReadableSpan,
        llmProviderCallSpan: ReadableSpan,
    ): void {
        let hlLog = readFromOpenTelemetrySpan(promptSpan, HUMANLOOP_LOG_KEY) || {};

        if (!hlLog.output_tokens) {
            hlLog.output_tokens = llmProviderCallSpan.attributes[
                AiSemanticConventions.LLM_USAGE_COMPLETION_TOKENS
            ] as number;
        }
        const completions = readFromOpenTelemetrySpan(
            llmProviderCallSpan,
            AiSemanticConventions.LLM_COMPLETIONS,
        ) as unknown as {
            finish_reason: string;
            role: string;
            content: string;
        }[];
        if (completions.length > 0) {
            // @ts-ignore
            hlLog.finish_reason = completions[0].finish_reason;
        }
        // @ts-ignore
        const messages = readFromOpenTelemetrySpan(
            llmProviderCallSpan,
            AiSemanticConventions.LLM_PROMPTS,
        ) as unknown as {
            role: string;
            content: string;
        }[];
        // @ts-ignore
        hlLog.messages = messages;

        // Edge case: Prompt used in streaming mode
        if (!("output" in hlLog) || hlLog.output === "{}") {
            hlLog.output = completions[0].content;
        }

        // Write the enriched prompt log back to the span
        writeToOpenTelemetrySpan(promptSpan, hlLog, HUMANLOOP_LOG_KEY);
    }
}
