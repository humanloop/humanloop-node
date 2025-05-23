/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../../../../index";

/**
 * @example
 *     {
 *         size: 1
 *     }
 */
export interface ListFlowsGetRequest {
    /**
     * Page number for pagination.
     */
    page?: number;
    /**
     * Page size for pagination. Number of Flows to fetch.
     */
    size?: number;
    /**
     * Case-insensitive filter for Flow name.
     */
    name?: string;
    /**
     * Case-insensitive filter for users in the Flow. This filter matches against both email address and name of users.
     */
    userFilter?: string;
    /**
     * Field to sort Flows by
     */
    sortBy?: Humanloop.FileSortBy;
    /**
     * Direction to sort by.
     */
    order?: Humanloop.SortOrder;
}
