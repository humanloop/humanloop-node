/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { DatasetResponse } from "./DatasetResponse";

export const PaginatedDataUnionPromptResponseToolResponseDatasetResponseEvaluatorResponseRecordsItem: core.serialization.Schema<
    serializers.PaginatedDataUnionPromptResponseToolResponseDatasetResponseEvaluatorResponseRecordsItem.Raw,
    Humanloop.PaginatedDataUnionPromptResponseToolResponseDatasetResponseEvaluatorResponseRecordsItem
> = core.serialization.undiscriminatedUnion([
    core.serialization.lazyObject(() => serializers.PromptResponse),
    core.serialization.lazyObject(() => serializers.ToolResponse),
    DatasetResponse,
    core.serialization.lazyObject(() => serializers.EvaluatorResponse),
]);

export declare namespace PaginatedDataUnionPromptResponseToolResponseDatasetResponseEvaluatorResponseRecordsItem {
    type Raw =
        | serializers.PromptResponse.Raw
        | serializers.ToolResponse.Raw
        | DatasetResponse.Raw
        | serializers.EvaluatorResponse.Raw;
}
