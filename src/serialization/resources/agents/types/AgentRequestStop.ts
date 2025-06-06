/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../index";
import * as Humanloop from "../../../../api/index";
import * as core from "../../../../core";

export const AgentRequestStop: core.serialization.Schema<serializers.AgentRequestStop.Raw, Humanloop.AgentRequestStop> =
    core.serialization.undiscriminatedUnion([
        core.serialization.string(),
        core.serialization.list(core.serialization.string()),
    ]);

export declare namespace AgentRequestStop {
    export type Raw = string | string[];
}
