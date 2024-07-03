/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const ModelEndpoints: core.serialization.Schema<serializers.ModelEndpoints.Raw, Humanloop.ModelEndpoints> =
    core.serialization.enum_(["complete", "chat", "edit"]);

export declare namespace ModelEndpoints {
    type Raw = "complete" | "chat" | "edit";
}
