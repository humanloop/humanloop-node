/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../index";
import * as Humanloop from "../../../../api/index";
import * as core from "../../../../core";
import { ToolChoice } from "../../../types/ToolChoice";

export const PromptLogUpdateRequestToolChoice: core.serialization.Schema<
    serializers.PromptLogUpdateRequestToolChoice.Raw,
    Humanloop.PromptLogUpdateRequestToolChoice
> = core.serialization.undiscriminatedUnion([
    core.serialization.stringLiteral("none"),
    core.serialization.stringLiteral("auto"),
    core.serialization.stringLiteral("required"),
    ToolChoice,
]);

export declare namespace PromptLogUpdateRequestToolChoice {
    export type Raw = "none" | "auto" | "required" | ToolChoice.Raw;
}
