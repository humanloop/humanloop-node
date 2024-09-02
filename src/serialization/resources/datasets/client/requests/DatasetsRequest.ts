/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../index";
import * as Humanloop from "../../../../../api/index";
import * as core from "../../../../../core";
import { CreateDatapointRequest } from "../../../../types/CreateDatapointRequest";
import { UpdateDatesetAction } from "../../../../types/UpdateDatesetAction";

export const DatasetsRequest: core.serialization.Schema<
    serializers.DatasetsRequest.Raw,
    Omit<Humanloop.DatasetsRequest, "versionId" | "environment">
> = core.serialization.object({
    path: core.serialization.string().optional(),
    id: core.serialization.string().optional(),
    datapoints: core.serialization.list(CreateDatapointRequest),
    action: UpdateDatesetAction.optional(),
    attributes: core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
    commitMessage: core.serialization.property("commit_message", core.serialization.string().optional()),
});

export declare namespace DatasetsRequest {
    interface Raw {
        path?: string | null;
        id?: string | null;
        datapoints: CreateDatapointRequest.Raw[];
        action?: UpdateDatesetAction.Raw | null;
        attributes?: Record<string, unknown> | null;
        commit_message?: string | null;
    }
}
