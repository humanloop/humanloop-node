/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const UpdateDatesetAction: core.serialization.Schema<
    serializers.UpdateDatesetAction.Raw,
    Humanloop.UpdateDatesetAction
> = core.serialization.enum_(["set", "add", "remove"]);

export declare namespace UpdateDatesetAction {
    export type Raw = "set" | "add" | "remove";
}
