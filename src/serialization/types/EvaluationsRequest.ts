/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const EvaluationsRequest: core.serialization.ObjectSchema<
    serializers.EvaluationsRequest.Raw,
    Humanloop.EvaluationsRequest
> = core.serialization.object({
    versionId: core.serialization.property("version_id", core.serialization.string().optional()),
    path: core.serialization.string().optional(),
    fileId: core.serialization.property("file_id", core.serialization.string().optional()),
    environment: core.serialization.string().optional(),
    orchestrated: core.serialization.boolean().optional(),
});

export declare namespace EvaluationsRequest {
    interface Raw {
        version_id?: string | null;
        path?: string | null;
        file_id?: string | null;
        environment?: string | null;
        orchestrated?: boolean | null;
    }
}
