/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

export interface PaginatedDataFlowResponse {
    records: Humanloop.FlowResponse[];
    page: number;
    size: number;
    total: number;
}
