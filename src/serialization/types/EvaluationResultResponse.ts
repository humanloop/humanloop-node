/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";
import { EvaluationResultResponseValue } from "./EvaluationResultResponseValue";

export const EvaluationResultResponse: core.serialization.ObjectSchema<
    serializers.EvaluationResultResponse.Raw,
    Humanloop.EvaluationResultResponse
> = core.serialization.object({
    id: core.serialization.string(),
    evaluatorId: core.serialization.property("evaluator_id", core.serialization.string()),
    evaluatorVersionId: core.serialization.property("evaluator_version_id", core.serialization.string()),
    evaluationId: core.serialization.property("evaluation_id", core.serialization.string().optional()),
    logId: core.serialization.property("log_id", core.serialization.string()),
    log: core.serialization.lazyObject(() => serializers.SrcExternalAppModelsV4LogLogResponse).optional(),
    versionId: core.serialization.property("version_id", core.serialization.string().optional()),
    version: core.serialization.unknown().optional(),
    value: EvaluationResultResponseValue.optional(),
    error: core.serialization.string().optional(),
    updatedAt: core.serialization.property("updated_at", core.serialization.date()),
    createdAt: core.serialization.property("created_at", core.serialization.date()),
    llmEvaluatorLog: core.serialization.property(
        "llm_evaluator_log",
        core.serialization.lazyObject(() => serializers.SrcExternalAppModelsV4LogLogResponse).optional()
    ),
});

export declare namespace EvaluationResultResponse {
    interface Raw {
        id: string;
        evaluator_id: string;
        evaluator_version_id: string;
        evaluation_id?: string | null;
        log_id: string;
        log?: serializers.SrcExternalAppModelsV4LogLogResponse.Raw | null;
        version_id?: string | null;
        version?: unknown | null;
        value?: EvaluationResultResponseValue.Raw | null;
        error?: string | null;
        updated_at: string;
        created_at: string;
        llm_evaluator_log?: serializers.SrcExternalAppModelsV4LogLogResponse.Raw | null;
    }
}
