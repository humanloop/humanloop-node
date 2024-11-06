/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../index";
import * as Humanloop from "../../../../../api/index";
import * as core from "../../../../../core";

export const AddLogsToRunRequest: core.serialization.Schema<
    serializers.AddLogsToRunRequest.Raw,
    Humanloop.AddLogsToRunRequest
> = core.serialization.object({
    logIds: core.serialization.property("log_ids", core.serialization.list(core.serialization.string())),
});

export declare namespace AddLogsToRunRequest {
    interface Raw {
        log_ids: string[];
    }
}
