import * as contextApi from "@opentelemetry/api";
import {
    HUMANLOOP_CONTEXT_EVALUATION,
    HUMANLOOP_CONTEXT_PROMPT,
    HUMANLOOP_CONTEXT_TRACE_ID,
} from "otel/constants";

export function getTraceId(): string | undefined {
    const key = contextApi.createContextKey(HUMANLOOP_CONTEXT_TRACE_ID);
    const value = contextApi.context.active().getValue(key);
    return (value || undefined) as string | undefined;
}

export function setTraceId(flowLogId: string): contextApi.Context {
    const key = contextApi.createContextKey(HUMANLOOP_CONTEXT_TRACE_ID);
    return contextApi.context.active().setValue(key, flowLogId);
}

export type PromptContext = {
    path: string;
    template?: string;
};

export function setPromptContext(promptContext: PromptContext): contextApi.Context {
    const key = contextApi.createContextKey(HUMANLOOP_CONTEXT_PROMPT);
    return contextApi.context.active().setValue(key, promptContext);
}

export function getPromptContext(): PromptContext | undefined {
    const key = contextApi.createContextKey(HUMANLOOP_CONTEXT_PROMPT);
    return (contextApi.context.active().getValue(key) || undefined) as
        | PromptContext
        | undefined;
}

export type EvaluationContext = {
    sourceDatapointId: string;
    runId: string;
    callback: (log_id: string) => void;
    fileId: string;
    path: string;
};

export function setEvaluationContext(
    evaluationContext: EvaluationContext,
): contextApi.Context {
    const key = contextApi.createContextKey(HUMANLOOP_CONTEXT_EVALUATION);
    return contextApi.context.active().setValue(key, evaluationContext);
}

export function getEvaluationContext(): EvaluationContext | undefined {
    const key = contextApi.createContextKey(HUMANLOOP_CONTEXT_EVALUATION);
    return (contextApi.context.active().getValue(key) || undefined) as
        | EvaluationContext
        | undefined;
}
