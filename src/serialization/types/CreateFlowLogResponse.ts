/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { TraceStatus } from "./TraceStatus";

export const CreateFlowLogResponse: core.serialization.ObjectSchema<
    serializers.CreateFlowLogResponse.Raw,
    Humanloop.CreateFlowLogResponse
> = core.serialization.object({
    id: core.serialization.string(),
    flowId: core.serialization.property("flow_id", core.serialization.string()),
    versionId: core.serialization.property("version_id", core.serialization.string()),
    traceStatus: core.serialization.property("trace_status", TraceStatus.optional()),
});

export declare namespace CreateFlowLogResponse {
    interface Raw {
        id: string;
        flow_id: string;
        version_id: string;
        trace_status?: TraceStatus.Raw | null;
    }
}