/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

export interface PaginatedDataAgentResponse {
    records: Humanloop.AgentResponse[];
    page: number;
    size: number;
    total: number;
}
