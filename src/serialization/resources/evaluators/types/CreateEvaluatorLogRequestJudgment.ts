/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../index";
import * as Humanloop from "../../../../api/index";
import * as core from "../../../../core";

export const CreateEvaluatorLogRequestJudgment: core.serialization.Schema<
    serializers.CreateEvaluatorLogRequestJudgment.Raw,
    Humanloop.CreateEvaluatorLogRequestJudgment
> = core.serialization.undiscriminatedUnion([
    core.serialization.boolean(),
    core.serialization.string(),
    core.serialization.list(core.serialization.string()),
    core.serialization.number(),
]);

export declare namespace CreateEvaluatorLogRequestJudgment {
    type Raw = boolean | string | string[] | number;
}
