/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { LogStatus } from "./LogStatus";

export const CreateFlowLogResponse: core.serialization.ObjectSchema<
    serializers.CreateFlowLogResponse.Raw,
    Humanloop.CreateFlowLogResponse
> = core.serialization.object({
    id: core.serialization.string(),
    flowId: core.serialization.property("flow_id", core.serialization.string()),
    versionId: core.serialization.property("version_id", core.serialization.string()),
    logStatus: core.serialization.property("log_status", LogStatus.optional()),
});

export declare namespace CreateFlowLogResponse {
    export interface Raw {
        id: string;
        flow_id: string;
        version_id: string;
        log_status?: LogStatus.Raw | null;
    }
}
