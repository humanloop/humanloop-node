/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const ProjectSortBy: core.serialization.Schema<serializers.ProjectSortBy.Raw, Humanloop.ProjectSortBy> =
    core.serialization.enum_(["created_at", "updated_at", "name"]);

export declare namespace ProjectSortBy {
    export type Raw = "created_at" | "updated_at" | "name";
}
