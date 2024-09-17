/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../../../index";
import * as Humanloop from "../../../../../api/index";
import * as core from "../../../../../core";

export const FlowRequest: core.serialization.Schema<serializers.FlowRequest.Raw, Humanloop.FlowRequest> =
    core.serialization.object({
        path: core.serialization.string().optional(),
        id: core.serialization.string().optional(),
        attributes: core.serialization.record(core.serialization.string(), core.serialization.unknown()),
        commitMessage: core.serialization.property("commit_message", core.serialization.string().optional()),
    });

export declare namespace FlowRequest {
    interface Raw {
        path?: string | null;
        id?: string | null;
        attributes: Record<string, unknown>;
        commit_message?: string | null;
    }
}
