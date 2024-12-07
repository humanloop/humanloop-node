import { ReadableSpan, SpanExporter, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
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

/**
 * Converts HrTime to seconds with fractions.
 *
 * @param hrTime - The High-Resolution Time tuple [seconds, nanoseconds].
 * @returns The time in seconds as a floating-point number.
 */
function hrTimeToSeconds(hrTime: [number, number]): number {
    const [seconds, nanoseconds] = hrTime;
    return (seconds + nanoseconds) / 1e9;
}

/**
 * Enriches Humanloop spans with data from their child spans.
 */
export class HumanloopSpanProcessor extends SimpleSpanProcessor {
    private spanExporter: SpanExporter;
    private children: Map<string, ReadableSpan[]>;

    constructor(exporter: SpanExporter) {
        super(exporter);
        this.spanExporter = exporter;
        this.children = new Map();
    }

    /**
     * Handles spans at the end of their lifecycle.
     * Enriches Humanloop spans or forwards non-Humanloop spans to the exporter.
     */
    onEnd(span: ReadableSpan): void {
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
            span.attributes[`${HUMANLOOP_LOG_KEY}.start_time`] = hrTimeToSeconds(span.startTime);
        }
        if (span.endTime) {
            span.attributes[`${HUMANLOOP_LOG_KEY}.end_time`] = hrTimeToSeconds(span.endTime);
            span.attributes[`${HUMANLOOP_LOG_KEY}.created_at`] = hrTimeToSeconds(span.endTime);
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
