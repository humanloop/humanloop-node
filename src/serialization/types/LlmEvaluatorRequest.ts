/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { EvaluatorArgumentsType } from "./EvaluatorArgumentsType";
import { EvaluatorReturnTypeEnum } from "./EvaluatorReturnTypeEnum";
import { EvaluatorJudgmentOptionResponse } from "./EvaluatorJudgmentOptionResponse";
import { EvaluatorJudgmentNumberLimit } from "./EvaluatorJudgmentNumberLimit";
import { Valence } from "./Valence";
import { PromptKernelRequest } from "./PromptKernelRequest";

export const LlmEvaluatorRequest: core.serialization.ObjectSchema<
    serializers.LlmEvaluatorRequest.Raw,
    Humanloop.LlmEvaluatorRequest
> = core.serialization.object({
    argumentsType: core.serialization.property("arguments_type", EvaluatorArgumentsType),
    returnType: core.serialization.property("return_type", EvaluatorReturnTypeEnum),
    attributes: core.serialization.record(core.serialization.string(), core.serialization.unknown()).optional(),
    options: core.serialization.list(EvaluatorJudgmentOptionResponse).optional(),
    numberLimits: core.serialization.property("number_limits", EvaluatorJudgmentNumberLimit.optional()),
    numberValence: core.serialization.property("number_valence", Valence.optional()),
    evaluatorType: core.serialization.property("evaluator_type", core.serialization.stringLiteral("llm")),
    prompt: PromptKernelRequest.optional(),
});

export declare namespace LlmEvaluatorRequest {
    export interface Raw {
        arguments_type: EvaluatorArgumentsType.Raw;
        return_type: EvaluatorReturnTypeEnum.Raw;
        attributes?: Record<string, unknown> | null;
        options?: EvaluatorJudgmentOptionResponse.Raw[] | null;
        number_limits?: EvaluatorJudgmentNumberLimit.Raw | null;
        number_valence?: Valence.Raw | null;
        evaluator_type: "llm";
        prompt?: PromptKernelRequest.Raw | null;
    }
}
