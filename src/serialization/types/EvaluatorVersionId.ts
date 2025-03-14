/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const EvaluatorVersionId: core.serialization.ObjectSchema<
    serializers.EvaluatorVersionId.Raw,
    Humanloop.EvaluatorVersionId
> = core.serialization.object({
    versionId: core.serialization.property("version_id", core.serialization.string()),
    orchestrated: core.serialization.boolean().optional(),
});

export declare namespace EvaluatorVersionId {
    export interface Raw {
        version_id: string;
        orchestrated?: boolean | null;
    }
}
