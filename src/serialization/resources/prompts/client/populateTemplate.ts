/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../index";
import * as core from "../../../../core";

export const Request: core.serialization.Schema<
    serializers.prompts.populateTemplate.Request.Raw,
    Record<string, unknown>
> = core.serialization.record(core.serialization.string(), core.serialization.unknown());

export declare namespace Request {
    type Raw = Record<string, unknown>;
}
