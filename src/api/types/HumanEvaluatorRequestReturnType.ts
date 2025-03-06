/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * The type of the return value of the Evaluator.
 */
export type HumanEvaluatorRequestReturnType = "select" | "multi_select" | "text" | "number" | "boolean";
export const HumanEvaluatorRequestReturnType = {
    Select: "select",
    MultiSelect: "multi_select",
    Text: "text",
    Number: "number",
    Boolean: "boolean",
} as const;
