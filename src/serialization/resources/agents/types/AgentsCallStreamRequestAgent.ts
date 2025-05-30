/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../index";
import * as Humanloop from "../../../../api/index";
import * as core from "../../../../core";
import { AgentKernelRequest } from "../../../types/AgentKernelRequest";

export const AgentsCallStreamRequestAgent: core.serialization.Schema<
    serializers.AgentsCallStreamRequestAgent.Raw,
    Humanloop.AgentsCallStreamRequestAgent
> = core.serialization.undiscriminatedUnion([AgentKernelRequest, core.serialization.string()]);

export declare namespace AgentsCallStreamRequestAgent {
    export type Raw = AgentKernelRequest.Raw | string;
}
