/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { ChatMessage } from "./ChatMessage";
import { DatapointResponseTargetValue } from "./DatapointResponseTargetValue";

export const DatapointResponse: core.serialization.ObjectSchema<
    serializers.DatapointResponse.Raw,
    Humanloop.DatapointResponse
> = core.serialization.object({
    inputs: core.serialization.record(core.serialization.string(), core.serialization.string()).optional(),
    messages: core.serialization.list(ChatMessage).optional(),
    target: core.serialization.record(core.serialization.string(), DatapointResponseTargetValue).optional(),
    id: core.serialization.string(),
});

export declare namespace DatapointResponse {
    export interface Raw {
        inputs?: Record<string, string> | null;
        messages?: ChatMessage.Raw[] | null;
        target?: Record<string, DatapointResponseTargetValue.Raw> | null;
        id: string;
    }
}
