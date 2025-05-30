/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const AgentKernelRequestStop: core.serialization.Schema<
    serializers.AgentKernelRequestStop.Raw,
    Humanloop.AgentKernelRequestStop
> = core.serialization.undiscriminatedUnion([
    core.serialization.string(),
    core.serialization.list(core.serialization.string()),
]);

export declare namespace AgentKernelRequestStop {
    export type Raw = string | string[];
}
