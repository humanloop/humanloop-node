/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * Status of a Log for observability.
 *
 * Observability is implemented by running monitoring Evaluators on Logs.
 */
export type ObservabilityStatus = "pending" | "running" | "completed" | "failed";

export const ObservabilityStatus = {
    Pending: "pending",
    Running: "running",
    Completed: "completed",
    Failed: "failed",
} as const;
