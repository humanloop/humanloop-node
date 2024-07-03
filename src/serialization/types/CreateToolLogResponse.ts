/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const CreateToolLogResponse: core.serialization.ObjectSchema<
    serializers.CreateToolLogResponse.Raw,
    Humanloop.CreateToolLogResponse
> = core.serialization.object({
    id: core.serialization.string(),
    toolId: core.serialization.property("tool_id", core.serialization.string()),
    versionId: core.serialization.property("version_id", core.serialization.string()),
    sessionId: core.serialization.property("session_id", core.serialization.string().optional()),
});

export declare namespace CreateToolLogResponse {
    interface Raw {
        id: string;
        tool_id: string;
        version_id: string;
        session_id?: string | null;
    }
}
