/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { EnvironmentTag } from "./EnvironmentTag";
import { FileEnvironmentResponseFile } from "./FileEnvironmentResponseFile";

export const FileEnvironmentResponse: core.serialization.ObjectSchema<
    serializers.FileEnvironmentResponse.Raw,
    Humanloop.FileEnvironmentResponse
> = core.serialization.object({
    id: core.serialization.string(),
    createdAt: core.serialization.property("created_at", core.serialization.date()),
    name: core.serialization.string(),
    tag: EnvironmentTag,
    file: FileEnvironmentResponseFile.optional(),
});

export declare namespace FileEnvironmentResponse {
    export interface Raw {
        id: string;
        created_at: string;
        name: string;
        tag: EnvironmentTag.Raw;
        file?: FileEnvironmentResponseFile.Raw | null;
    }
}
