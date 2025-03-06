import {
    CreateEvaluatorLogRequest,
    CreateFlowLogResponse,
    CreateToolLogResponse,
    FlowLogRequest,
    PromptCallResponse,
    PromptLogRequest,
    ToolLogRequest,
} from "api";

import { Evaluators } from "./api/resources/evaluators/client/Client";
import { Flows } from "./api/resources/flows/client/Client";
import { Prompts } from "./api/resources/prompts/client/Client";
import { Tools } from "./api/resources/tools/client/Client";
import { getDecoratorContext, getEvaluationContext, getTraceId } from "./eval_utils";

export function overloadLog<T extends Flows | Prompts | Tools | Evaluators>(
    client: T,
): T {
    const originalLog = client.log.bind(client);

    const _overloadedLog = async (
        request: T extends Flows
            ? FlowLogRequest
            : T extends Prompts
              ? PromptLogRequest
              : T extends Tools
                ? ToolLogRequest
                : T extends Evaluators
                  ? CreateEvaluatorLogRequest
                  : never,
        options?: T extends Flows
            ? Flows.RequestOptions
            : T extends Prompts
              ? Prompts.RequestOptions
              : T extends Tools
                ? Tools.RequestOptions
                : T extends Evaluators
                  ? Evaluators.RequestOptions
                  : never,
    ) => {
        const decoratorContext = getDecoratorContext();
        const evaluationContext = getEvaluationContext();

        if (
            decoratorContext !== undefined &&
            decoratorContext.type === "prompt" &&
            client instanceof Prompts
        ) {
            console.warn(
                "You are using prompts.log() inside a Prompt-decorated function. This is discouraged.",
            );
        }
        const traceId = getTraceId();
        if (traceId !== undefined) {
            if ("traceParentId" in request) {
                // TODO: revisit
                console.warn("Overriding trace_parent_id argument");
            }
            request = {
                ...request,
                traceParentId: traceId,
            };
        }

        if (evaluationContext !== undefined) {
            if ("sourceDatapointId" in request) {
                console.warn(
                    "You are trying to create a Log with a `sourceDatapointId` argument while running a local eval. The argument will be ignored.",
                );
                delete request.sourceDatapointId;
            }
            if ("runId" in request) {
                console.warn(
                    "You are trying to create a Log with a `runId` argument while running a local eval. The argument will be ignored.",
                );
                delete request.runId;
            }
        }

        let response: // @ts-ignore TODO: revisit
        | CreatePromptLogResponse
            | CreateFlowLogResponse
            | CreateToolLogResponse
            | undefined = undefined;
        try {
            // @ts-ignore
            response = await originalLog(request, options);
        } catch (e) {
            // TODO: revisit
            console.error(e);
        }
        return response;
    };

    // @ts-ignore _overloadedLog is a polymorphic function and
    // linting complains about typing
    client.log = _overloadedLog.bind(client);

    // @ts-ignore
    client._log = originalLog.bind(client);

    return client;
}

export function overloadCall(client: Prompts): Prompts {
    const originalCall = client.call.bind(client);

    const _overloadedCall = async (
        request: PromptLogRequest,
        options?: Prompts.RequestOptions,
    ): Promise<PromptCallResponse> => {
        const decoratorContext = getDecoratorContext();
        const evaluationContext = getEvaluationContext();

        if (
            decoratorContext !== undefined &&
            decoratorContext.type === "prompt" &&
            client instanceof Prompts
        ) {
            console.warn(
                "You are using prompts.call() inside a Prompt-decorated function. This is discouraged.",
            );
        }
        const traceId = getTraceId();
        if (traceId !== undefined) {
            if ("traceParentId" in request) {
                // TODO: revisit
                console.warn("Overriding trace_parent_id argument");
            }
            request = {
                ...request,
                traceParentId: traceId,
            };
        }

        if (evaluationContext !== undefined) {
            if ("sourceDatapointId" in request) {
                console.warn(
                    "You are trying to create a Log with a `sourceDatapointId` argument while running a local eval. The argument will be ignored.",
                );
                delete request.sourceDatapointId;
            }
            if ("runId" in request) {
                console.warn(
                    "You are trying to create a Log with a `runId` argument while running a local eval. The argument will be ignored.",
                );
                delete request.runId;
            }
        }
        let response: PromptCallResponse | undefined = undefined;
        response = await originalCall(request, options);
        try {
        } catch (e: any) {
            // TODO: revisit
            console.error(e);
            throw new Error(`HumanloopUtilityError: ${e.message}`);
        }
        return response;
    };

    // @ts-ignore _overloadedCall is a polymorphic function and
    // linting complains about typing
    client.call = _overloadedCall.bind(client);

    return client;
}
