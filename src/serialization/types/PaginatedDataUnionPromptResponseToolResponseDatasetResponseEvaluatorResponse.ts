/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { PaginatedDataUnionPromptResponseToolResponseDatasetResponseEvaluatorResponseRecordsItem } from "./PaginatedDataUnionPromptResponseToolResponseDatasetResponseEvaluatorResponseRecordsItem";

export const PaginatedDataUnionPromptResponseToolResponseDatasetResponseEvaluatorResponse: core.serialization.ObjectSchema<
    serializers.PaginatedDataUnionPromptResponseToolResponseDatasetResponseEvaluatorResponse.Raw,
    Humanloop.PaginatedDataUnionPromptResponseToolResponseDatasetResponseEvaluatorResponse
> = core.serialization.object({
    records: core.serialization.list(
        PaginatedDataUnionPromptResponseToolResponseDatasetResponseEvaluatorResponseRecordsItem
    ),
    page: core.serialization.number(),
    size: core.serialization.number(),
    total: core.serialization.number(),
});

export declare namespace PaginatedDataUnionPromptResponseToolResponseDatasetResponseEvaluatorResponse {
    interface Raw {
        records: PaginatedDataUnionPromptResponseToolResponseDatasetResponseEvaluatorResponseRecordsItem.Raw[];
        page: number;
        size: number;
        total: number;
    }
}
