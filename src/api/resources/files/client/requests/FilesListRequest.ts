/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../../../../index";

/**
 * @example
 *     {}
 */
export interface FilesListRequest {
    /**
     * Page offset for pagination.
     */
    page?: number;
    /**
     * Page size for pagination. Number of files to fetch.
     */
    size?: number;
    /**
     * Case-insensitive filter for file name.
     */
    name?: string;
    /**
     * List of file types to filter for.
     */
    type?: Humanloop.FileType | Humanloop.FileType[];
    /**
     * Case-sensitive filter for files with a deployment in the specified environment. Requires the environment name.
     */
    environment?: string;
    /**
     * Field to sort files by
     */
    sortBy?: Humanloop.ProjectSortBy;
    /**
     * Direction to sort by.
     */
    order?: Humanloop.SortOrder;
}