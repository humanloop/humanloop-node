/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { EnvironmentResponse } from "./EnvironmentResponse";
import { UserResponse } from "./UserResponse";
import { VersionStatus } from "./VersionStatus";
import { DatapointResponse } from "./DatapointResponse";

export const DatasetResponse: core.serialization.ObjectSchema<
    serializers.DatasetResponse.Raw,
    Humanloop.DatasetResponse
> = core.serialization.object({
    path: core.serialization.string(),
    id: core.serialization.string(),
    directoryId: core.serialization.property("directory_id", core.serialization.string().optional()),
    name: core.serialization.string(),
    versionId: core.serialization.property("version_id", core.serialization.string()),
    type: core.serialization.stringLiteral("dataset").optional(),
    environments: core.serialization.list(EnvironmentResponse).optional(),
    createdAt: core.serialization.property("created_at", core.serialization.date()),
    updatedAt: core.serialization.property("updated_at", core.serialization.date()),
    createdBy: core.serialization.property("created_by", UserResponse.optional()),
    status: VersionStatus,
    lastUsedAt: core.serialization.property("last_used_at", core.serialization.date()),
    commitMessage: core.serialization.property("commit_message", core.serialization.string().optional()),
    datapointsCount: core.serialization.property("datapoints_count", core.serialization.number()),
    datapoints: core.serialization.list(DatapointResponse).optional(),
});

export declare namespace DatasetResponse {
    interface Raw {
        path: string;
        id: string;
        directory_id?: string | null;
        name: string;
        version_id: string;
        type?: "dataset" | null;
        environments?: EnvironmentResponse.Raw[] | null;
        created_at: string;
        updated_at: string;
        created_by?: UserResponse.Raw | null;
        status: VersionStatus.Raw;
        last_used_at: string;
        commit_message?: string | null;
        datapoints_count: number;
        datapoints?: DatapointResponse.Raw[] | null;
    }
}
