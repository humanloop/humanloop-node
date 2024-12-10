import { ReadableSpan, Span, SpanExporter, SpanProcessor } from "@opentelemetry/sdk-trace-base";
import { ExportResult, ExportResultCode } from "@opentelemetry/core";
import {
    isHumanloopSpan,
    isLLMProviderCall,
    NestedDict,
    readFromOpenTelemetrySpan,
    writeToOpenTelemetrySpan,
} from "./helpers";
import { HUMANLOOP_FILE_KEY, HUMANLOOP_FILE_TYPE_KEY, HUMANLOOP_LOG_KEY } from "./constants";
import { PromptKernelRequest } from "api/types/PromptKernelRequest";
import { ModelEndpoints, ModelProviders } from "api";
import { SpanAttributes as AiSemanticConventions } from "@traceloop/ai-semantic-conventions";
import { Context } from "@opentelemetry/api";

/**
 * Enriches Humanloop spans with data from their child spans.
 */
export class HumanloopSpanProcessor implements SpanProcessor {
    private spanExporter: SpanExporter;
    private children: Map<string, ReadableSpan[]>;

    constructor(exporter: SpanExporter) {
        this.spanExporter = exporter;
        this.children = new Map();
    }

    async forceFlush(): Promise<void> {}

    onStart(span: Span, parentContext: Context): void {}

    async shutdown(): Promise<void> {}

    /**
     * Handles spans at the end of their lifecycle.
     * Enriches Humanloop spans or forwards non-Humanloop spans to the exporter.
     */
    onEnd(span: ReadableSpan): void {
        console.log("onEnd", span.attributes);
        if (isHumanloopSpan(span)) {
            this.processSpanDispatch(span, this.children.get(span.spanContext().spanId) || []);
            this.children.delete(span.spanContext().spanId); // Release references
        } else if (span.parentSpanId && this.isInstrumentorSpan(span)) {
            this.children.set(span.parentSpanId, [...(this.children.get(span.parentSpanId) || []), span]);
        }

        this.spanExporter.export([span], (result: ExportResult) => {
            if (result.code !== ExportResultCode.SUCCESS) {
                console.error("Failed to export span:", result.error);
            }
        });
    }

    /**
     * Determines if a span is created by an instrumentor of interest.
     */
    private isInstrumentorSpan(span: ReadableSpan): boolean {
        return isLLMProviderCall(span);
    }

    /**
     * Processes spans based on their type and enriches them if applicable.
     */
    private processSpanDispatch(span: ReadableSpan, childrenSpans: ReadableSpan[]): void {
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
                this.processPrompt(span, childrenSpans);
                break;
            case "tool":
            case "flow":
                // Placeholder for processing other file types
                break;
            default:
                console.error("Unknown Humanloop File Span", span);
        }
    }

    /**
     * Processes and enriches spans of type "prompt".
     */
    private processPrompt(promptSpan: ReadableSpan, childrenSpans: ReadableSpan[]): void {
        if (childrenSpans.length === 0) return;

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
    private enrichPromptKernel(promptSpan: ReadableSpan, llmProviderCallSpan: ReadableSpan): void {
        const hlFile = readFromOpenTelemetrySpan(promptSpan, HUMANLOOP_FILE_KEY) || {};

        const prompt = (hlFile.prompt || {}) as unknown as PromptKernelRequest;

        // Assign or infer values for the prompt kernel
        prompt.model =
            prompt.model || (llmProviderCallSpan.attributes[AiSemanticConventions.LLM_REQUEST_MODEL] as string);
        if (prompt.model === undefined) {
            throw new Error("Could not infer required parameter `model`. Please provide it in the prompt kernel.");
        }
        prompt.endpoint =
            prompt.endpoint ||
            (llmProviderCallSpan.attributes[AiSemanticConventions.LLM_REQUEST_TYPE] as ModelEndpoints);
        prompt.provider =
            prompt.provider ||
            ((
                llmProviderCallSpan.attributes[AiSemanticConventions.LLM_SYSTEM] as string
            ).toLowerCase() as ModelProviders);
        prompt.temperature =
            prompt.temperature ||
            (llmProviderCallSpan.attributes[AiSemanticConventions.LLM_REQUEST_TEMPERATURE] as number);
        prompt.topP =
            prompt.topP || (llmProviderCallSpan.attributes[AiSemanticConventions.LLM_REQUEST_TOP_P] as number);
        prompt.maxTokens =
            prompt.maxTokens ||
            (llmProviderCallSpan.attributes[AiSemanticConventions.LLM_REQUEST_MAX_TOKENS] as number);
        prompt.frequencyPenalty =
            prompt.frequencyPenalty ||
            (llmProviderCallSpan.attributes[AiSemanticConventions.LLM_FREQUENCY_PENALTY] as number);
        prompt.tools = prompt.tools || [];

        // Write the enriched prompt kernel back to the span
        writeToOpenTelemetrySpan(promptSpan, prompt as unknown as NestedDict, `${HUMANLOOP_FILE_KEY}.prompt`);
    }

    /**
     * Enriches the prompt log of a prompt span using information from a child span.
     */
    private enrichPromptLog(promptSpan: ReadableSpan, llmProviderCallSpan: ReadableSpan): void {
        console.log("WOW", promptSpan.attributes, llmProviderCallSpan.attributes);
        let hlLog = readFromOpenTelemetrySpan(promptSpan, HUMANLOOP_LOG_KEY) || {};

        if (!hlLog.output_tokens) {
            hlLog.output_tokens = llmProviderCallSpan.attributes[
                AiSemanticConventions.LLM_USAGE_COMPLETION_TOKENS
            ] as number;
        }
        const completions = readFromOpenTelemetrySpan(
            llmProviderCallSpan,
            AiSemanticConventions.LLM_COMPLETIONS
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
            AiSemanticConventions.LLM_PROMPTS
        ) as unknown as {
            role: string;
            content: string;
        }[];
        // @ts-ignore
        hlLog.messages = messages;

        // Write the enriched prompt log back to the span
        writeToOpenTelemetrySpan(promptSpan, hlLog, HUMANLOOP_LOG_KEY);
    }
}
