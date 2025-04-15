import { Agents } from "api/resources/agents/client/Client";
import {
    CreateEvaluatorLogRequest,
    FlowLogRequest,
    PromptCallResponse,
    PromptLogRequest,
    ToolLogRequest,
} from "./api";
import { Evaluators } from "./api/resources/evaluators/client/Client";
import { Flows } from "./api/resources/flows/client/Client";
import { Prompts } from "./api/resources/prompts/client/Client";
import { Tools } from "./api/resources/tools/client/Client";
import { getDecoratorContext, getEvaluationContext, getTraceId } from "./context";
import { HumanloopRuntimeError } from "./error";

export function overloadLog<T extends Flows | Prompts | Tools | Evaluators | Agents>(
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
                  : T extends Agents
                    ? Agents.RequestOptions
                    : never,
    ) => {
        const traceId = getTraceId();
        if (traceId !== undefined && client instanceof Flows) {
            const context = getDecoratorContext();
            if (context === undefined) {
                throw new HumanloopRuntimeError(
                    "Internal error: trace_id context is set outside a decorator context.",
                );
            }
            throw new HumanloopRuntimeError(
                `Using flows.log() is not allowed: Flow decorator for File ${context.path} manages the tracing and trace completion.`,
            );
        }

        if (traceId !== undefined) {
            if ("traceParentId" in request) {
                console.warn(
                    "Ignoring trace_parent_id argument: the Flow decorator manages tracing.",
                );
            }
            request = {
                ...request,
                traceParentId: traceId,
            };
        }

        const evaluationContext = getEvaluationContext();
        if (evaluationContext !== undefined) {
            const [kwargsEval, evalCallback] = evaluationContext.logArgsWithContext({
                logArgs: request,
                forOtel: true,
                path: request.path,
            });
            try {
                // @ts-ignore Polymorphism alarms the type checker
                const response = await originalLog(kwargsEval, options);
                if (evalCallback !== null) {
                    await evalCallback(response.id);
                }
                return response;
            } catch (e) {
                throw new HumanloopRuntimeError(String(e));
            }
        } else {
            try {
                // @ts-ignore Polymorphism alarms the type checker
                return await originalLog(request, options);
            } catch (e) {
                throw new HumanloopRuntimeError(String(e));
            }
        }
    };

    // @ts-ignore
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
        const traceId = getTraceId();
        if (traceId !== undefined) {
            if ("traceParentId" in request) {
                console.warn(
                    "Ignoring trace_parent_id argument: the Flow decorator manages tracing.",
                );
            }
            request = {
                ...request,
                traceParentId: traceId,
            };
        }

        try {
            return await originalCall(request, options);
        } catch (e) {
            throw new HumanloopRuntimeError(String(e));
        }
    };

    client.call = _overloadedCall.bind(client);

    return client;
}
