/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

export interface PaginatedSessionResponse {
    records: Humanloop.SessionResponse[];
    page: number;
    size: number;
    total: number;
}
