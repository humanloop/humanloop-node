/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const ObservabilityStatus: core.serialization.Schema<
    serializers.ObservabilityStatus.Raw,
    Humanloop.ObservabilityStatus
> = core.serialization.enum_(["pending", "running", "completed", "failed"]);

export declare namespace ObservabilityStatus {
    export type Raw = "pending" | "running" | "completed" | "failed";
}
