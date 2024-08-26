/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../../../../index";

/**
 * @example
 *     {
 *         path: "Shared Evaluators/Accuracy Evaluator",
 *         spec: {
 *             argumentsType: Humanloop.EvaluatorArgumentsType.TargetRequired,
 *             returnType: Humanloop.EvaluatorReturnTypeEnum.Number,
 *             evaluatorType: "python",
 *             code: "def evaluate(answer, target):\n    return 0.5"
 *         },
 *         commitMessage: "Initial commit"
 *     }
 */
export interface EvaluatorsRequest {
    /** Path of the Evaluator, including the name. This locates the Evaluator in the Humanloop filesystem and is used as as a unique identifier. Example: `folder/name` or just `name`. */
    path?: string;
    /** ID for an existing Evaluator. */
    id?: string;
    /** Message describing the changes made. */
    commitMessage?: string;
    spec: Humanloop.SrcExternalAppModelsV5EvaluatorsEvaluatorRequestSpec;
}
