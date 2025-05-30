/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * Specify the detail level of the image provided to the model. For more details see: https://platform.openai.com/docs/guides/vision/low-or-high-fidelity-image-understanding
 */
export type ImageUrlDetail = "high" | "low" | "auto";
export const ImageUrlDetail = {
    High: "high",
    Low: "low",
    Auto: "auto",
} as const;
