/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const VersionIdResponse: core.serialization.ObjectSchema<
    serializers.VersionIdResponse.Raw,
    Humanloop.VersionIdResponse
> = core.serialization.object({
    version: core.serialization.lazy(() => serializers.VersionIdResponseVersion),
    type: core.serialization.stringLiteral("version"),
});

export declare namespace VersionIdResponse {
    export interface Raw {
        version: serializers.VersionIdResponseVersion.Raw;
        type: "version";
    }
}
