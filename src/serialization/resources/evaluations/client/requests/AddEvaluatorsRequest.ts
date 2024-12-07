/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../index";
import * as Humanloop from "../../../../../api/index";
import * as core from "../../../../../core";
import { AddEvaluatorsRequestEvaluatorsItem } from "../../types/AddEvaluatorsRequestEvaluatorsItem";

export const AddEvaluatorsRequest: core.serialization.Schema<
    serializers.AddEvaluatorsRequest.Raw,
    Humanloop.AddEvaluatorsRequest
> = core.serialization.object({
    evaluators: core.serialization.list(AddEvaluatorsRequestEvaluatorsItem),
});

export declare namespace AddEvaluatorsRequest {
    interface Raw {
        evaluators: AddEvaluatorsRequestEvaluatorsItem.Raw[];
    }
}