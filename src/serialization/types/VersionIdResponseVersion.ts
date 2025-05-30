/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { DatasetResponse } from "./DatasetResponse";

export const VersionIdResponseVersion: core.serialization.Schema<
    serializers.VersionIdResponseVersion.Raw,
    Humanloop.VersionIdResponseVersion
> = core.serialization.undiscriminatedUnion([
    core.serialization.lazyObject(() => serializers.PromptResponse),
    core.serialization.lazyObject(() => serializers.ToolResponse),
    DatasetResponse,
    core.serialization.lazyObject(() => serializers.EvaluatorResponse),
    core.serialization.lazyObject(() => serializers.FlowResponse),
    core.serialization.lazyObject(() => serializers.AgentResponse),
]);

export declare namespace VersionIdResponseVersion {
    export type Raw =
        | serializers.PromptResponse.Raw
        | serializers.ToolResponse.Raw
        | DatasetResponse.Raw
        | serializers.EvaluatorResponse.Raw
        | serializers.FlowResponse.Raw
        | serializers.AgentResponse.Raw;
}
