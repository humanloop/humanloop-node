/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const FunctionTool: core.serialization.ObjectSchema<serializers.FunctionTool.Raw, Humanloop.FunctionTool> =
    core.serialization.object({
        name: core.serialization.string(),
        arguments: core.serialization.string().optional(),
    });

export declare namespace FunctionTool {
    export interface Raw {
        name: string;
        arguments?: string | null;
    }
}
