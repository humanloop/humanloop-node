/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { ToolChoice } from "./ToolChoice";

export const AgentContinueCallResponseToolChoice: core.serialization.Schema<
    serializers.AgentContinueCallResponseToolChoice.Raw,
    Humanloop.AgentContinueCallResponseToolChoice
> = core.serialization.undiscriminatedUnion([
    core.serialization.stringLiteral("none"),
    core.serialization.stringLiteral("auto"),
    core.serialization.stringLiteral("required"),
    ToolChoice,
]);

export declare namespace AgentContinueCallResponseToolChoice {
    export type Raw = "none" | "auto" | "required" | ToolChoice.Raw;
}
