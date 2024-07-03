/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const EvaluationDebugResultResponseValue: core.serialization.Schema<
    serializers.EvaluationDebugResultResponseValue.Raw,
    Humanloop.EvaluationDebugResultResponseValue
> = core.serialization.undiscriminatedUnion([core.serialization.boolean(), core.serialization.number()]);

export declare namespace EvaluationDebugResultResponseValue {
    type Raw = boolean | number;
}
