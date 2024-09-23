/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * Enum for File types.
 */
export type FileType = "prompt" | "tool" | "dataset" | "evaluator" | "flow";

export const FileType = {
    Prompt: "prompt",
    Tool: "tool",
    Dataset: "dataset",
    Evaluator: "evaluator",
    Flow: "flow",
} as const;