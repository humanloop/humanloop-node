/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { EnvironmentTag } from "./EnvironmentTag";

export const EnvironmentResponse: core.serialization.ObjectSchema<
    serializers.EnvironmentResponse.Raw,
    Humanloop.EnvironmentResponse
> = core.serialization.object({
    id: core.serialization.string(),
    createdAt: core.serialization.property("created_at", core.serialization.date()),
    name: core.serialization.string(),
    tag: EnvironmentTag,
});

export declare namespace EnvironmentResponse {
    interface Raw {
        id: string;
        created_at: string;
        name: string;
        tag: EnvironmentTag.Raw;
    }
}
