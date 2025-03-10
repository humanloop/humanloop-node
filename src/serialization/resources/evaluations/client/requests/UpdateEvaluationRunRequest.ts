/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../index";
import * as Humanloop from "../../../../../api/index";
import * as core from "../../../../../core";
import { EvaluationStatus } from "../../../../types/EvaluationStatus";

export const UpdateEvaluationRunRequest: core.serialization.Schema<
    serializers.UpdateEvaluationRunRequest.Raw,
    Humanloop.UpdateEvaluationRunRequest
> = core.serialization.object({
    control: core.serialization.boolean().optional(),
    status: EvaluationStatus.optional(),
});

export declare namespace UpdateEvaluationRunRequest {
    export interface Raw {
        control?: boolean | null;
        status?: EvaluationStatus.Raw | null;
    }
}
