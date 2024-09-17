/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * @example
 *     {
 *         attributes: {
 *             "key": "value"
 *         }
 *     }
 */
export interface FlowRequest {
    /** Path of the Flow, including the name. This locates the Flow in the Humanloop filesystem and is used as as a unique identifier. Example: `folder/name` or just `name`. */
    path?: string;
    /** ID for an existing Flow. */
    id?: string;
    /** A key-value object identifying the Flow Version. */
    attributes: Record<string, unknown>;
    /** Message describing the changes made. */
    commitMessage?: string;
}
