/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const PlatformAccessEnum: core.serialization.Schema<
    serializers.PlatformAccessEnum.Raw,
    Humanloop.PlatformAccessEnum
> = core.serialization.enum_(["superadmin", "supportadmin", "user"]);

export declare namespace PlatformAccessEnum {
    export type Raw = "superadmin" | "supportadmin" | "user";
}
