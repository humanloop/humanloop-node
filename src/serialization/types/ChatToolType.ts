/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const ChatToolType: core.serialization.Schema<serializers.ChatToolType.Raw, Humanloop.ChatToolType> =
    core.serialization.stringLiteral("function");

export declare namespace ChatToolType {
    type Raw = "function";
}
