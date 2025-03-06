/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { DatapointResponse } from "./DatapointResponse";

export const PaginatedDatapointResponse: core.serialization.ObjectSchema<
    serializers.PaginatedDatapointResponse.Raw,
    Humanloop.PaginatedDatapointResponse
> = core.serialization.object({
    records: core.serialization.list(DatapointResponse),
    page: core.serialization.number(),
    size: core.serialization.number(),
    total: core.serialization.number(),
});

export declare namespace PaginatedDatapointResponse {
    export interface Raw {
        records: DatapointResponse.Raw[];
        page: number;
        size: number;
        total: number;
    }
}
