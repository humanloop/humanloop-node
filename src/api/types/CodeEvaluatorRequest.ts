/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

export interface CodeEvaluatorRequest {
    /** Whether this evaluator is target-free or target-required. */
    argumentsType: Humanloop.EvaluatorArgumentsType;
    /** The type of the return value of the evaluator. */
    returnType: Humanloop.EvaluatorReturnTypeEnum;
    evaluatorType: "python";
    /** The code for the evaluator. This code will be executed in a sandboxed environment. */
    code?: string;
}
