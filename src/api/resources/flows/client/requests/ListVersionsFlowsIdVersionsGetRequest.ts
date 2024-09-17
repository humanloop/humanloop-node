/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../../../../index";

/**
 * @example
 *     {}
 */
export interface ListVersionsFlowsIdVersionsGetRequest {
    /**
     * Filter versions by status: 'uncommitted', 'committed'. If no status is provided, all versions are returned.
     */
    status?: Humanloop.VersionStatus;
    /**
     * Whether to include Evaluator aggregate results for the versions in the response
     */
    evaluatorAggregates?: boolean;
}
