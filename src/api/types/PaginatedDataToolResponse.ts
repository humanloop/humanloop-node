/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

export interface PaginatedDataToolResponse {
    records: (Humanloop.ToolResponse | undefined)[];
    page: number;
    size: number;
    total: number;
}
