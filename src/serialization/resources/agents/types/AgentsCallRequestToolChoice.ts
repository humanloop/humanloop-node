/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../index";
import * as Humanloop from "../../../../api/index";
import * as core from "../../../../core";
import { ToolChoice } from "../../../types/ToolChoice";

export const AgentsCallRequestToolChoice: core.serialization.Schema<
    serializers.AgentsCallRequestToolChoice.Raw,
    Humanloop.AgentsCallRequestToolChoice
> = core.serialization.undiscriminatedUnion([
    core.serialization.stringLiteral("none"),
    core.serialization.stringLiteral("auto"),
    core.serialization.stringLiteral("required"),
    ToolChoice,
]);

export declare namespace AgentsCallRequestToolChoice {
    export type Raw = "none" | "auto" | "required" | ToolChoice.Raw;
}
