/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { PromptLogResponse } from "./PromptLogResponse";
import { ToolLogResponse } from "./ToolLogResponse";
import { EvaluatorLogResponse } from "./EvaluatorLogResponse";

export const SrcExternalAppModelsV5LogsLogResponse: core.serialization.Schema<
    serializers.SrcExternalAppModelsV5LogsLogResponse.Raw,
    Humanloop.SrcExternalAppModelsV5LogsLogResponse
> = core.serialization.undiscriminatedUnion([PromptLogResponse, ToolLogResponse, EvaluatorLogResponse]);

export declare namespace SrcExternalAppModelsV5LogsLogResponse {
    type Raw = PromptLogResponse.Raw | ToolLogResponse.Raw | EvaluatorLogResponse.Raw;
}