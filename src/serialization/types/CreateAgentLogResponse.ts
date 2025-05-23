/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { LogStatus } from "./LogStatus";

export const CreateAgentLogResponse: core.serialization.ObjectSchema<
    serializers.CreateAgentLogResponse.Raw,
    Humanloop.CreateAgentLogResponse
> = core.serialization.object({
    id: core.serialization.string(),
    agentId: core.serialization.property("agent_id", core.serialization.string()),
    versionId: core.serialization.property("version_id", core.serialization.string()),
    logStatus: core.serialization.property("log_status", LogStatus.optional()),
});

export declare namespace CreateAgentLogResponse {
    export interface Raw {
        id: string;
        agent_id: string;
        version_id: string;
        log_status?: LogStatus.Raw | null;
    }
}
