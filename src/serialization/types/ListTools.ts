/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { ToolResponse } from "./ToolResponse";

export const ListTools: core.serialization.ObjectSchema<serializers.ListTools.Raw, Humanloop.ListTools> =
    core.serialization.object({
        records: core.serialization.list(ToolResponse),
    });

export declare namespace ListTools {
    interface Raw {
        records: (ToolResponse.Raw | undefined)[];
    }
}
