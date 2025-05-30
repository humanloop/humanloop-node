/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const MonitoringEvaluatorEnvironmentRequest: core.serialization.ObjectSchema<
    serializers.MonitoringEvaluatorEnvironmentRequest.Raw,
    Humanloop.MonitoringEvaluatorEnvironmentRequest
> = core.serialization.object({
    evaluatorId: core.serialization.property("evaluator_id", core.serialization.string()),
    environmentId: core.serialization.property("environment_id", core.serialization.string()),
});

export declare namespace MonitoringEvaluatorEnvironmentRequest {
    export interface Raw {
        evaluator_id: string;
        environment_id: string;
    }
}
