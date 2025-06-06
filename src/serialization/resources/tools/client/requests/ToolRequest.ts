/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../index";
import * as Humanloop from "../../../../../api/index";
import * as core from "../../../../../core";
import { ToolFunction } from "../../../../types/ToolFunction";
import { FilesToolType } from "../../../../types/FilesToolType";

export const ToolRequest: core.serialization.Schema<serializers.ToolRequest.Raw, Humanloop.ToolRequest> =
    core.serialization.object({
        path: core.serialization.string().optional(),
        id: core.serialization.string().optional(),
        function: ToolFunction.optional(),
        sourceCode: core.serialization.property("source_code", core.serialization.string().optional()),
        setupValues: core.serialization.property(
            "setup_values",
            core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
        ),
        attributes: core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
        toolType: core.serialization.property("tool_type", FilesToolType.optional()),
        versionName: core.serialization.property("version_name", core.serialization.string().optional()),
        versionDescription: core.serialization.property("version_description", core.serialization.string().optional()),
    });

export declare namespace ToolRequest {
    export interface Raw {
        path?: string | null;
        id?: string | null;
        function?: ToolFunction.Raw | null;
        source_code?: string | null;
        setup_values?: Record<string, unknown> | null;
        attributes?: Record<string, unknown> | null;
        tool_type?: FilesToolType.Raw | null;
        version_name?: string | null;
        version_description?: string | null;
    }
}
