/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as Humanloop from "../../api/index";
import * as core from "../../core";

export const EvaluatorAggregate: core.serialization.ObjectSchema<
    serializers.EvaluatorAggregate.Raw,
    Humanloop.EvaluatorAggregate
> = core.serialization.object({
    value: core.serialization.number(),
    evaluatorId: core.serialization.property("evaluator_id", core.serialization.string()),
    evaluatorVersionId: core.serialization.property("evaluator_version_id", core.serialization.string()),
    createdAt: core.serialization.property("created_at", core.serialization.date()),
    updatedAt: core.serialization.property("updated_at", core.serialization.date()),
});

export declare namespace EvaluatorAggregate {
    interface Raw {
        value: number;
        evaluator_id: string;
        evaluator_version_id: string;
        created_at: string;
        updated_at: string;
    }
}
