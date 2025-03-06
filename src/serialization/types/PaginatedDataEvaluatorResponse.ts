/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const PaginatedDataEvaluatorResponse: core.serialization.ObjectSchema<
    serializers.PaginatedDataEvaluatorResponse.Raw,
    Humanloop.PaginatedDataEvaluatorResponse
> = core.serialization.object({
    records: core.serialization.list(core.serialization.lazyObject(() => serializers.EvaluatorResponse)),
    page: core.serialization.number(),
    size: core.serialization.number(),
    total: core.serialization.number(),
});

export declare namespace PaginatedDataEvaluatorResponse {
    export interface Raw {
        records: serializers.EvaluatorResponse.Raw[];
        page: number;
        size: number;
        total: number;
    }
}
