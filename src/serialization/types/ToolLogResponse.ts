/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { LogStatus } from "./LogStatus";

export const ToolLogResponse: core.serialization.ObjectSchema<
    serializers.ToolLogResponse.Raw,
    Humanloop.ToolLogResponse
> = core.serialization.object({
    startTime: core.serialization.property("start_time", core.serialization.date().optional()),
    endTime: core.serialization.property("end_time", core.serialization.date().optional()),
    output: core.serialization.string().optional(),
    createdAt: core.serialization.property("created_at", core.serialization.date().optional()),
    error: core.serialization.string().optional(),
    providerLatency: core.serialization.property("provider_latency", core.serialization.number().optional()),
    stdout: core.serialization.string().optional(),
    providerRequest: core.serialization.property(
        "provider_request",
        core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
    ),
    providerResponse: core.serialization.property(
        "provider_response",
        core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
    ),
    inputs: core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
    source: core.serialization.string().optional(),
    metadata: core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
    logStatus: core.serialization.property("log_status", LogStatus.optional()),
    sourceDatapointId: core.serialization.property("source_datapoint_id", core.serialization.string().optional()),
    traceParentId: core.serialization.property("trace_parent_id", core.serialization.string().optional()),
    batches: core.serialization.list(core.serialization.string()).optional(),
    user: core.serialization.string().optional(),
    environment: core.serialization.string().optional(),
    save: core.serialization.boolean().optional(),
    logId: core.serialization.property("log_id", core.serialization.string().optional()),
    id: core.serialization.string(),
    evaluatorLogs: core.serialization.property(
        "evaluator_logs",
        core.serialization.list(core.serialization.lazyObject(() => serializers.EvaluatorLogResponse)),
    ),
    traceFlowId: core.serialization.property("trace_flow_id", core.serialization.string().optional()),
    traceId: core.serialization.property("trace_id", core.serialization.string().optional()),
    traceChildren: core.serialization.property(
        "trace_children",
        core.serialization.list(core.serialization.lazy(() => serializers.LogResponse)).optional(),
    ),
    tool: core.serialization.lazyObject(() => serializers.ToolResponse),
});

export declare namespace ToolLogResponse {
    export interface Raw {
        start_time?: string | null;
        end_time?: string | null;
        output?: string | null;
        created_at?: string | null;
        error?: string | null;
        provider_latency?: number | null;
        stdout?: string | null;
        provider_request?: Record<string, unknown> | null;
        provider_response?: Record<string, unknown> | null;
        inputs?: Record<string, unknown> | null;
        source?: string | null;
        metadata?: Record<string, unknown> | null;
        log_status?: LogStatus.Raw | null;
        source_datapoint_id?: string | null;
        trace_parent_id?: string | null;
        batches?: string[] | null;
        user?: string | null;
        environment?: string | null;
        save?: boolean | null;
        log_id?: string | null;
        id: string;
        evaluator_logs: serializers.EvaluatorLogResponse.Raw[];
        trace_flow_id?: string | null;
        trace_id?: string | null;
        trace_children?: serializers.LogResponse.Raw[] | null;
        tool: serializers.ToolResponse.Raw;
    }
}
