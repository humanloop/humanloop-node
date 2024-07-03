/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { ToolSource } from "./ToolSource";

export const ToolConfigRequest: core.serialization.ObjectSchema<
    serializers.ToolConfigRequest.Raw,
    Humanloop.ToolConfigRequest
> = core.serialization.object({
    name: core.serialization.string(),
    description: core.serialization.string().optional(),
    parameters: core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
    source: ToolSource.optional(),
    sourceCode: core.serialization.property("source_code", core.serialization.string().optional()),
    other: core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
    presetName: core.serialization.property("preset_name", core.serialization.string().optional()),
    type: core.serialization.stringLiteral("tool"),
});

export declare namespace ToolConfigRequest {
    interface Raw {
        name: string;
        description?: string | null;
        parameters?: Record<string, unknown> | null;
        source?: ToolSource.Raw | null;
        source_code?: string | null;
        other?: Record<string, unknown> | null;
        preset_name?: string | null;
        type: "tool";
    }
}
