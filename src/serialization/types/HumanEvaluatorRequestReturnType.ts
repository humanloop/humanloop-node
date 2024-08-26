/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const HumanEvaluatorRequestReturnType: core.serialization.Schema<
    serializers.HumanEvaluatorRequestReturnType.Raw,
    Humanloop.HumanEvaluatorRequestReturnType
> = core.serialization.enum_(["select", "multi_select", "text", "number", "boolean"]);

export declare namespace HumanEvaluatorRequestReturnType {
    type Raw = "select" | "multi_select" | "text" | "number" | "boolean";
}
