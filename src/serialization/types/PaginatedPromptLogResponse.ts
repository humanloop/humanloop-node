/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { PromptLogResponse } from "./PromptLogResponse";

export const PaginatedPromptLogResponse: core.serialization.ObjectSchema<
    serializers.PaginatedPromptLogResponse.Raw,
    Humanloop.PaginatedPromptLogResponse
> = core.serialization.object({
    records: core.serialization.list(PromptLogResponse),
    page: core.serialization.number(),
    size: core.serialization.number(),
    total: core.serialization.number(),
});

export declare namespace PaginatedPromptLogResponse {
    interface Raw {
        records: PromptLogResponse.Raw[];
        page: number;
        size: number;
        total: number;
    }
}
