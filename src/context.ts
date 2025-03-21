import * as otel_api from "@opentelemetry/api";
import { AsyncHooksContextManager } from "@opentelemetry/context-async-hooks";

import { HumanloopRuntimeError } from "./error";
import {
    HUMANLOOP_CONTEXT_DECORATOR,
    HUMANLOOP_CONTEXT_EVALUATION,
    HUMANLOOP_CONTEXT_TRACE_ID,
} from "./otel/constants";

export const HL_CONTEXT = new AsyncHooksContextManager();
HL_CONTEXT.enable();

export function getTraceId(): string | undefined {
    const key = otel_api.createContextKey(HUMANLOOP_CONTEXT_TRACE_ID);
    const value = HL_CONTEXT.active().getValue(key);
    return (value || undefined) as string | undefined;
}

export function setTraceId(flowLogId: string): otel_api.Context {
    const key = otel_api.createContextKey(HUMANLOOP_CONTEXT_TRACE_ID);
    return HL_CONTEXT.active().setValue(key, flowLogId);
}

export type DecoratorContext = {
    path: string;
    type: "prompt" | "tool" | "flow";
    version: Record<string, unknown>;
};

export function setDecoratorContext(
    decoratorContext: DecoratorContext,
): otel_api.Context {
    const key = otel_api.createContextKey(HUMANLOOP_CONTEXT_DECORATOR);
    return HL_CONTEXT.active().setValue(key, decoratorContext);
}

export function getDecoratorContext(): DecoratorContext | undefined {
    const key = otel_api.createContextKey(HUMANLOOP_CONTEXT_DECORATOR);
    return (HL_CONTEXT.active().getValue(key) || undefined) as
        | DecoratorContext
        | undefined;
}

export class EvaluationContext {
    public sourceDatapointId: string;
    public runId: string;
    public fileId: string;
    public path: string;
    private _logged: boolean;
    private _callback: (log_id: string) => Promise<void>;

    constructor({
        sourceDatapointId,
        runId,
        evalCallback,
        fileId,
        path,
    }: {
        sourceDatapointId: string;
        runId: string;
        evalCallback: (log_id: string) => Promise<void>;
        fileId: string;
        path: string;
    }) {
        this.sourceDatapointId = sourceDatapointId;
        this.runId = runId;
        this._callback = evalCallback;
        this.fileId = fileId;
        this.path = path;
        this._logged = false;
    }

    public get logged(): boolean {
        return this._logged;
    }

    public logArgsWithContext({
        logArgs,
        forOtel,
        path,
        fileId,
    }: {
        logArgs: Record<string, any>;
        forOtel: boolean;
        path?: string;
        fileId?: string;
    }): [Record<string, any>, ((log_id: string) => Promise<void>) | null] {
        if (path === undefined && fileId === undefined) {
            throw new HumanloopRuntimeError(
                "Internal error: Evaluation context called without providing a path or file_id",
            );
        }

        if (this._logged) {
            return [logArgs, null];
        }

        if (this.path !== undefined && this.path === path) {
            this._logged = true;
            return [
                forOtel
                    ? {
                          ...logArgs,
                          source_datapoint_id: this.sourceDatapointId,
                          run_id: this.runId,
                      }
                    : {
                          ...logArgs,
                          sourceDatapointId: this.sourceDatapointId,
                          runId: this.runId,
                      },
                this._callback,
            ];
        } else if (this.fileId !== undefined && this.fileId === fileId) {
            this._logged = true;
            return [
                forOtel
                    ? {
                          ...logArgs,
                          sourceDatapointId: this.sourceDatapointId,
                          runId: this.runId,
                      }
                    : {
                          ...logArgs,
                          sourceDatapointId: this.sourceDatapointId,
                          runId: this.runId,
                      },
                this._callback,
            ];
        } else {
            return [logArgs, null];
        }
    }
}

// ... existing code ...

export function setEvaluationContext(
    evaluationContext: EvaluationContext,
): otel_api.Context {
    const key = otel_api.createContextKey(HUMANLOOP_CONTEXT_EVALUATION);
    return HL_CONTEXT.active().setValue(key, evaluationContext);
}

export function getEvaluationContext(): EvaluationContext | undefined {
    const key = otel_api.createContextKey(HUMANLOOP_CONTEXT_EVALUATION);
    return (HL_CONTEXT.active().getValue(key) || undefined) as
        | EvaluationContext
        | undefined;
}
