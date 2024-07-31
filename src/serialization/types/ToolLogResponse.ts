/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const ToolLogResponse: core.serialization.ObjectSchema<
    serializers.ToolLogResponse.Raw,
    Humanloop.ToolLogResponse
> = core.serialization.object({
    output: core.serialization.string().optional(),
    createdAt: core.serialization.property("created_at", core.serialization.date().optional()),
    error: core.serialization.string().optional(),
    providerLatency: core.serialization.property("provider_latency", core.serialization.number().optional()),
    providerRequest: core.serialization.property(
        "provider_request",
        core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional()
    ),
    providerResponse: core.serialization.property(
        "provider_response",
        core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional()
    ),
    sessionId: core.serialization.property("session_id", core.serialization.string().optional()),
    parentId: core.serialization.property("parent_id", core.serialization.string().optional()),
    inputs: core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
    source: core.serialization.string().optional(),
    metadata: core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
    save: core.serialization.boolean().optional(),
    sourceDatapointId: core.serialization.property("source_datapoint_id", core.serialization.string().optional()),
    batches: core.serialization.list(core.serialization.string()).optional(),
    user: core.serialization.string().optional(),
    environment: core.serialization.string().optional(),
    id: core.serialization.string(),
    tool: core.serialization.lazyObject(() => serializers.ToolResponse),
});

export declare namespace ToolLogResponse {
    interface Raw {
        output?: string | null;
        created_at?: string | null;
        error?: string | null;
        provider_latency?: number | null;
        provider_request?: Record<string, unknown> | null;
        provider_response?: Record<string, unknown> | null;
        session_id?: string | null;
        parent_id?: string | null;
        inputs?: Record<string, unknown> | null;
        source?: string | null;
        metadata?: Record<string, unknown> | null;
        save?: boolean | null;
        source_datapoint_id?: string | null;
        batches?: string[] | null;
        user?: string | null;
        environment?: string | null;
        id: string;
        tool: serializers.ToolResponse.Raw;
    }
}
