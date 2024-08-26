/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { EvaluatorArgumentsType } from "./EvaluatorArgumentsType";
import { HumanEvaluatorRequestReturnType } from "./HumanEvaluatorRequestReturnType";
import { EvaluatorJudgmentOptionResponse } from "./EvaluatorJudgmentOptionResponse";
import { EvaluatorJudgmentNumberLimit } from "./EvaluatorJudgmentNumberLimit";
import { Valence } from "./Valence";

export const HumanEvaluatorRequest: core.serialization.ObjectSchema<
    serializers.HumanEvaluatorRequest.Raw,
    Humanloop.HumanEvaluatorRequest
> = core.serialization.object({
    argumentsType: core.serialization.property("arguments_type", EvaluatorArgumentsType),
    returnType: core.serialization.property("return_type", HumanEvaluatorRequestReturnType),
    evaluatorType: core.serialization.property("evaluator_type", core.serialization.stringLiteral("human")),
    instructions: core.serialization.string().optional(),
    options: core.serialization.list(EvaluatorJudgmentOptionResponse).optional(),
    numberLimits: core.serialization.property("number_limits", EvaluatorJudgmentNumberLimit.optional()),
    numberValence: core.serialization.property("number_valence", Valence.optional()),
});

export declare namespace HumanEvaluatorRequest {
    interface Raw {
        arguments_type: EvaluatorArgumentsType.Raw;
        return_type: HumanEvaluatorRequestReturnType.Raw;
        evaluator_type: "human";
        instructions?: string | null;
        options?: EvaluatorJudgmentOptionResponse.Raw[] | null;
        number_limits?: EvaluatorJudgmentNumberLimit.Raw | null;
        number_valence?: Valence.Raw | null;
    }
}
