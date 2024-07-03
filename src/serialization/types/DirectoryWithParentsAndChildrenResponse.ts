/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { DirectoryResponse } from "./DirectoryResponse";
import { DirectoryWithParentsAndChildrenResponseFilesItem } from "./DirectoryWithParentsAndChildrenResponseFilesItem";

export const DirectoryWithParentsAndChildrenResponse: core.serialization.ObjectSchema<
    serializers.DirectoryWithParentsAndChildrenResponse.Raw,
    Humanloop.DirectoryWithParentsAndChildrenResponse
> = core.serialization.object({
    name: core.serialization.string(),
    parentId: core.serialization.property("parent_id", core.serialization.string().optional()),
    id: core.serialization.string(),
    createdAt: core.serialization.property("created_at", core.serialization.date()),
    updatedAt: core.serialization.property("updated_at", core.serialization.date()),
    subdirectories: core.serialization.list(DirectoryResponse),
    files: core.serialization.list(DirectoryWithParentsAndChildrenResponseFilesItem),
    parents: core.serialization.list(DirectoryResponse),
});

export declare namespace DirectoryWithParentsAndChildrenResponse {
    interface Raw {
        name: string;
        parent_id?: string | null;
        id: string;
        created_at: string;
        updated_at: string;
        subdirectories: DirectoryResponse.Raw[];
        files: DirectoryWithParentsAndChildrenResponseFilesItem.Raw[];
        parents: DirectoryResponse.Raw[];
    }
}
