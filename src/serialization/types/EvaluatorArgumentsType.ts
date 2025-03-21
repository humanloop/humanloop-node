/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const EvaluatorArgumentsType: core.serialization.Schema<
    serializers.EvaluatorArgumentsType.Raw,
    Humanloop.EvaluatorArgumentsType
> = core.serialization.enum_(["target_free", "target_required"]);

export declare namespace EvaluatorArgumentsType {
    export type Raw = "target_free" | "target_required";
}
