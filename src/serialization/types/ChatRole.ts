/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const ChatRole: core.serialization.Schema<serializers.ChatRole.Raw, Humanloop.ChatRole> =
    core.serialization.enum_(["user", "assistant", "system", "tool", "developer"]);

export declare namespace ChatRole {
    export type Raw = "user" | "assistant" | "system" | "tool" | "developer";
}
