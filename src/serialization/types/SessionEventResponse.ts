/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const SessionEventResponse: core.serialization.ObjectSchema<
    serializers.SessionEventResponse.Raw,
    Humanloop.SessionEventResponse
> = core.serialization.object({
    log: core.serialization.lazy(() => serializers.LogResponse),
    children: core.serialization.list(core.serialization.lazyObject(() => serializers.SessionEventResponse)),
});

export declare namespace SessionEventResponse {
    interface Raw {
        log: serializers.LogResponse.Raw;
        children: serializers.SessionEventResponse.Raw[];
    }
}
