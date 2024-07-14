/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const ListPrompts: core.serialization.ObjectSchema<serializers.ListPrompts.Raw, Humanloop.ListPrompts> =
    core.serialization.object({
        records: core.serialization.list(core.serialization.lazyObject(() => serializers.PromptResponse)),
    });

export declare namespace ListPrompts {
    interface Raw {
        records: serializers.PromptResponse.Raw[];
    }
}
