/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const FilePath: core.serialization.ObjectSchema<serializers.FilePath.Raw, Humanloop.FilePath> =
    core.serialization.object({
        environment: core.serialization.string().optional(),
        path: core.serialization.string(),
    });

export declare namespace FilePath {
    interface Raw {
        environment?: string | null;
        path: string;
    }
}
