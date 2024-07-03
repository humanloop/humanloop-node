/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../index";
import * as Humanloop from "../../../../../api/index";
import * as core from "../../../../../core";

export const CreateDirectoryRequest: core.serialization.Schema<
    serializers.CreateDirectoryRequest.Raw,
    Humanloop.CreateDirectoryRequest
> = core.serialization.object({
    name: core.serialization.string(),
    parentId: core.serialization.property("parent_id", core.serialization.string()),
});

export declare namespace CreateDirectoryRequest {
    interface Raw {
        name: string;
        parent_id: string;
    }
}
