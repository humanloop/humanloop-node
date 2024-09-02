/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

export interface ExternalEvaluatorRequest {
    /** Whether this evaluator is target-free or target-required. */
    argumentsType: Humanloop.EvaluatorArgumentsType;
    /** The type of the return value of the evaluator. */
    returnType: Humanloop.EvaluatorReturnTypeEnum;
    /** Additional fields to describe the Evaluator. Helpful to separate Evaluator versions from each other with details on how they were created or used. */
    attributes?: Record<string, unknown>;
    evaluatorType: "external";
}
