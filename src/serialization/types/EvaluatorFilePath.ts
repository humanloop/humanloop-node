/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const EvaluatorFilePath: core.serialization.ObjectSchema<
    serializers.EvaluatorFilePath.Raw,
    Humanloop.EvaluatorFilePath
> = core.serialization.object({
    environment: core.serialization.string().optional(),
    path: core.serialization.string(),
    orchestrated: core.serialization.boolean().optional(),
});

export declare namespace EvaluatorFilePath {
    interface Raw {
        environment?: string | null;
        path: string;
        orchestrated?: boolean | null;
    }
}