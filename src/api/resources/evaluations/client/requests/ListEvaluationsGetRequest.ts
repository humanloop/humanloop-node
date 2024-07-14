/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * @example
 *     {
 *         fileId: "pr_30gco7dx6JDq4200GVOHa",
 *         size: 1
 *     }
 */
export interface ListEvaluationsGetRequest {
    /**
     * Filter by File ID. Only Evaluations for the specified File will be returned.
     */
    fileId: string;
    /**
     * Page number for pagination.
     */
    page?: number;
    /**
     * Page size for pagination. Number of Evaluations to fetch.
     */
    size?: number;
}
