/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

export interface PaginatedEvaluationResponse {
    records: Humanloop.EvaluationResponse[];
    page: number;
    size: number;
    total: number;
}
