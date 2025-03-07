import { Context } from "@opentelemetry/api";
import {
    ReadableSpan,
    Span,
    SpanExporter,
    SpanProcessor,
} from "@opentelemetry/sdk-trace-node";

import { getDecoratorContext, getEvaluationContext, getTraceId } from "../context";
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
            const decoratorContext = getDecoratorContext();
            if (decoratorContext && decoratorContext.type === "prompt") {
                const { path, version } = decoratorContext;
                const template = version?.template;
                span = span.setAttribute(HUMANLOOP_PATH_KEY, path);
                span = span.setAttribute(HUMANLOOP_FILE_TYPE_KEY, "prompt");
                if (template !== undefined) {
                    span = span.setAttribute(
                        `${HUMANLOOP_FILE_KEY}.template`,
                        // @ts-ignore
                        template,
                    );
                }
            }
            const traceId = getTraceId();
            if (traceId) {
                span.setAttribute(`${HUMANLOOP_LOG_KEY}.trace_parent_id`, traceId);
            }
        }
    }

    onEnd(span: ReadableSpan): void {
        if (isLLMProviderCall(span)) {
            const decoratorContext = getDecoratorContext();
            if (!decoratorContext || decoratorContext.type !== "prompt") {
                // User made a provider call outside a @prompt context, ignore the span
                return;
            }
            const evaluationContext = getEvaluationContext();
            if (evaluationContext && evaluationContext.path === decoratorContext.path) {
                // User made a provider call inside an evaluation context
                // Ignore the span, evaluations.run() will use the output
                // of the decorated function to create the Log
                return;
            }
        }
        this.spanExporter.export([span], () => {});
    }

    async shutdown(): Promise<void> {
        return this.spanExporter.shutdown();
    }

    async forceFlush(): Promise<void> {}
}
