/**
 * This file was auto-generated by Fern from our API Definition.
 */

export interface FileRequest {
    /** ID for an existing File. */
    id?: string;
    /** Path of the File, including the name. This locates the File in the Humanloop filesystem and is used as as a unique identifier. For example: `folder/name` or just `name`. */
    path?: string;
}
