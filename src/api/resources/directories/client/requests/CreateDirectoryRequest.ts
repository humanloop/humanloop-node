/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * @example
 *     {}
 */
export interface CreateDirectoryRequest {
    /** Name of the directory to create. */
    name?: string;
    /** ID of the parent directory. Starts with `dir_`. */
    parentId?: string;
    /** Path to create the directory in, relative to the root directory. If the path does not exist, it will be created. Includes name, e.g. `path/to/directory`. */
    path?: string;
}
