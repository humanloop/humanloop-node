/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * @example
 *     {}
 */
export interface UpdateFlowRequest {
    /** Path of the Flow including the Flow name, which is used as a unique identifier. */
    path?: string;
    /** Name of the Flow. */
    name?: string;
    /** Unique identifier for the Directory to move Flow to. Starts with `dir_`. */
    directoryId?: string;
}