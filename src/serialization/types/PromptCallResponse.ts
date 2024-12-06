/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { ChatMessage } from "./ChatMessage";
import { PromptCallResponseToolChoice } from "./PromptCallResponseToolChoice";
import { PromptCallLogResponse } from "./PromptCallLogResponse";

export const PromptCallResponse: core.serialization.ObjectSchema<
    serializers.PromptCallResponse.Raw,
    Humanloop.PromptCallResponse
> = core.serialization.object({
    startTime: core.serialization.property("start_time", core.serialization.date().optional()),
    endTime: core.serialization.property("end_time", core.serialization.date().optional()),
    messages: core.serialization.list(ChatMessage).optional(),
    toolChoice: core.serialization.property("tool_choice", PromptCallResponseToolChoice.optional()),
    prompt: core.serialization.lazyObject(() => serializers.PromptResponse),
    inputs: core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
    source: core.serialization.string().optional(),
    metadata: core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
    sourceDatapointId: core.serialization.property("source_datapoint_id", core.serialization.string().optional()),
    traceParentId: core.serialization.property("trace_parent_id", core.serialization.string().optional()),
    user: core.serialization.string().optional(),
    environment: core.serialization.string().optional(),
    save: core.serialization.boolean().optional(),
    logId: core.serialization.property("log_id", core.serialization.string().optional()),
    id: core.serialization.string(),
    traceId: core.serialization.property("trace_id", core.serialization.string().optional()),
    logs: core.serialization.list(PromptCallLogResponse),
});

export declare namespace PromptCallResponse {
    interface Raw {
        start_time?: string | null;
        end_time?: string | null;
        messages?: ChatMessage.Raw[] | null;
        tool_choice?: PromptCallResponseToolChoice.Raw | null;
        prompt: serializers.PromptResponse.Raw;
        inputs?: Record<string, unknown> | null;
        source?: string | null;
        metadata?: Record<string, unknown> | null;
        source_datapoint_id?: string | null;
        trace_parent_id?: string | null;
        user?: string | null;
        environment?: string | null;
        save?: boolean | null;
        log_id?: string | null;
        id: string;
        trace_id?: string | null;
        logs: PromptCallLogResponse.Raw[];
    }
}
