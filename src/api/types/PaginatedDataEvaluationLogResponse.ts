/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

export interface PaginatedDataEvaluationLogResponse {
    records: Humanloop.EvaluationLogResponse[];
    page: number;
    size: number;
    total: number;
}
