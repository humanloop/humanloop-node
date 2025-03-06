/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../index";
import * as Humanloop from "../../../../api/index";
import * as core from "../../../../core";
import { FileEnvironmentResponse } from "../../../types/FileEnvironmentResponse";

export const Response: core.serialization.Schema<
    serializers.prompts.listEnvironments.Response.Raw,
    Humanloop.FileEnvironmentResponse[]
> = core.serialization.list(FileEnvironmentResponse);

export declare namespace Response {
    export type Raw = FileEnvironmentResponse.Raw[];
}
