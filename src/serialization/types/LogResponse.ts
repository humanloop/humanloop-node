/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const LogResponse: core.serialization.Schema<serializers.LogResponse.Raw, Humanloop.LogResponse> =
    core.serialization.undiscriminatedUnion([
        core.serialization.lazyObject(() => serializers.PromptLogResponse),
        core.serialization.lazyObject(() => serializers.ToolLogResponse),
        core.serialization.lazyObject(() => serializers.EvaluatorLogResponse),
        core.serialization.lazyObject(() => serializers.FlowLogResponse),
    ]);

export declare namespace LogResponse {
    type Raw =
        | serializers.PromptLogResponse.Raw
        | serializers.ToolLogResponse.Raw
        | serializers.EvaluatorLogResponse.Raw
        | serializers.FlowLogResponse.Raw;
}
