/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { EvaluationEvaluatorResponse } from "./EvaluationEvaluatorResponse";
import { UserResponse } from "./UserResponse";

export const EvaluationResponse: core.serialization.ObjectSchema<
    serializers.EvaluationResponse.Raw,
    Humanloop.EvaluationResponse
> = core.serialization.object({
    id: core.serialization.string(),
    runsCount: core.serialization.property("runs_count", core.serialization.number()),
    evaluators: core.serialization.list(EvaluationEvaluatorResponse),
    name: core.serialization.string().optional(),
    fileId: core.serialization.property("file_id", core.serialization.string().optional()),
    createdAt: core.serialization.property("created_at", core.serialization.date()),
    createdBy: core.serialization.property("created_by", UserResponse.optional()),
    updatedAt: core.serialization.property("updated_at", core.serialization.date()),
    url: core.serialization.string().optional(),
});

export declare namespace EvaluationResponse {
    export interface Raw {
        id: string;
        runs_count: number;
        evaluators: EvaluationEvaluatorResponse.Raw[];
        name?: string | null;
        file_id?: string | null;
        created_at: string;
        created_by?: (UserResponse.Raw | undefined) | null;
        updated_at: string;
        url?: string | null;
    }
}
