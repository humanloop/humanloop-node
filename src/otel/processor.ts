import { Context } from "@opentelemetry/api";
import {
    ReadableSpan,
    Span,
    SpanExporter,
    SpanProcessor,
} from "@opentelemetry/sdk-trace-node";
import { getPromptContext, getTraceId } from "eval_utils/context";

import {
    HUMANLOOP_FILE_KEY,
    HUMANLOOP_FILE_TYPE_KEY,
    HUMANLOOP_LOG_KEY,
    HUMANLOOP_PATH_KEY,
} from "./constants";
import { isLLMProviderCall } from "./helpers";

export class HumanloopSpanProcessor implements SpanProcessor {
    private spanExporter: SpanExporter;

    constructor(exporter: SpanExporter) {
        this.spanExporter = exporter;
    }

    onStart(span: Span, _: Context): void {
        if (isLLMProviderCall(span)) {
            const promptContext = getPromptContext();
            if (promptContext !== undefined) {
                const { path, template } = promptContext;
                span.setAttribute(HUMANLOOP_PATH_KEY, path);
                span.setAttribute(HUMANLOOP_FILE_TYPE_KEY, "prompt");
                if (template) {
                    span.setAttribute(`${HUMANLOOP_FILE_KEY}.template`, template);
                }
            } else {
                // TODO: handle
                throw new Error("Provider call outside @prompt");
            }
            const traceId = getTraceId();
            if (traceId !== undefined) {
                span = span.setAttribute(
                    `${HUMANLOOP_LOG_KEY}.trace_parent_id`,
                    traceId,
                );
            }
        }
    }

    onEnd(span: ReadableSpan): void {
        this.spanExporter.export([span], () => {});
    }

    async shutdown(): Promise<void> {
        return this.spanExporter.shutdown();
    }

    async forceFlush(): Promise<void> {}
}
