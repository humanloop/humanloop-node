/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const TimeUnit: core.serialization.Schema<serializers.TimeUnit.Raw, Humanloop.TimeUnit> =
    core.serialization.enum_(["day", "week", "month"]);

export declare namespace TimeUnit {
    type Raw = "day" | "week" | "month";
}
