import {
    CreateFlowLogResponse,
    CreateToolLogResponse,
    FlowLogRequest,
    PromptCallResponse,
    PromptLogRequest,
} from "api";
import { Flows } from "api/resources/flows/client/Client";
import { Prompts } from "api/resources/prompts/client/Client";
import { Tools } from "api/resources/tools/client/Client";
import { getTraceId } from "eval_utils";

export function overloadLog<T extends Flows | Prompts | Tools>(client: T): T {
    const originalLog = client.log.bind(client);

    const _overloadedLog = async (
        request: T extends Flows ? FlowLogRequest : PromptLogRequest,
        options?: T extends Flows ? Flows.RequestOptions : Prompts.RequestOptions,
    ) => {
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

        let response: // @ts-ignore TODO: revisit
        | CreatePromptLogResponse
            | CreateFlowLogResponse
            | CreateToolLogResponse
            | undefined = undefined;
        try {
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
                // TODO: revisit
                console.warn("Overriding trace_parent_id argument");
            }
            request = {
                ...request,
                traceParentId: traceId,
            };
        }

        let response: PromptCallResponse | undefined = undefined;
        response = await originalCall(request, options);
        try {
        } catch (e) {
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
