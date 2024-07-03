/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const MonitoringEvaluatorVersionRequest: core.serialization.ObjectSchema<
    serializers.MonitoringEvaluatorVersionRequest.Raw,
    Humanloop.MonitoringEvaluatorVersionRequest
> = core.serialization.object({
    evaluatorVersionId: core.serialization.property("evaluator_version_id", core.serialization.string()),
});

export declare namespace MonitoringEvaluatorVersionRequest {
    interface Raw {
        evaluator_version_id: string;
    }
}
