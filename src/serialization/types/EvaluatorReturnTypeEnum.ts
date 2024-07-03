/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const EvaluatorReturnTypeEnum: core.serialization.Schema<
    serializers.EvaluatorReturnTypeEnum.Raw,
    Humanloop.EvaluatorReturnTypeEnum
> = core.serialization.enum_(["boolean", "number"]);

export declare namespace EvaluatorReturnTypeEnum {
    type Raw = "boolean" | "number";
}
