import path from "path";

import {
    CreateEvaluatorLogRequest, FlowLogRequest, PromptLogRequest,
    ToolLogRequest
} from "./api";
import { Agents } from "./api/resources/agents/client/Client";
import { Evaluators } from "./api/resources/evaluators/client/Client";
import { Flows } from "./api/resources/flows/client/Client";
import { Prompts } from "./api/resources/prompts/client/Client";
import { Tools } from "./api/resources/tools/client/Client";
import { getDecoratorContext, getEvaluationContext, getTraceId } from "./context";
import { HumanloopRuntimeError } from "./error";
import FileSyncer, {
    SERIALIZABLE_FILE_TYPES,
    SerializableFileType,
} from "./sync/FileSyncer";

type ClientType = Flows | Agents | Prompts | Tools | Evaluators;
type LogRequestType =
    | FlowLogRequest
    | PromptLogRequest
    | ToolLogRequest
    | CreateEvaluatorLogRequest;

/**
 * Get the file type based on the client type.
 * Only returns types that can be loaded from local filesystem.
 */
function getFileTypeFromClient(client: ClientType): SerializableFileType | null {
    if (client instanceof Prompts) {
        return "prompt";
    } else if (client instanceof Agents) {
        return "agent";
    } else if (client instanceof Tools) {
        return null; // Tools don't support local files
    } else if (client instanceof Flows) {
        return null; // Flows don't support local files
    } else if (client instanceof Evaluators) {
        return null; // Evaluators don't support local files
    } else {
        throw new HumanloopRuntimeError(
            // @ts-ignore Client shouldn't be of a type other than those checked above, but included as a safeguard
            `Unsupported client type: ${client.constructor.name}`,
        );
    }
}

/**
 * Handle tracing context for both log and call methods.
 */
function handleTracingContext<T extends LogRequestType>(
    request: T,
    client: ClientType,
): T {
    const traceId = getTraceId();
    if (traceId !== undefined) {
        if (client instanceof Flows) {
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

        if ("traceParentId" in request) {
            console.warn(
                "Ignoring trace_parent_id argument: the Flow decorator manages tracing.",
            );
        }
        return {
            ...request,
            traceParentId: traceId,
        };
    }
    return request;
}

/**
 * Load .prompt/.agent file content from local filesystem into API request.
 */
function handleLocalFiles<T extends LogRequestType>(
    request: T,
    client: ClientType,
    fileSyncer: FileSyncer,
): T {
    // Validate request has either id or path, but not both
    if ("id" in request && "path" in request) {
        throw new HumanloopRuntimeError("Cannot specify both `id` and `path`");
    }
    if (!("id" in request) && !("path" in request)) {
        throw new HumanloopRuntimeError("Must specify either `id` or `path`");
    }

    // If using id, we can't use local files
    if ("id" in request) {
        return request;
    }

    const filePath = request.path;
    if (!filePath) {
        throw new HumanloopRuntimeError("Path cannot be empty");
    }

    // Check for path format issues (absolute paths or leading/trailing slashes)
    const normalizedPath = filePath.trim().replace(/^\/+|\/+$/g, "");
    if (path.isAbsolute(filePath) || filePath !== normalizedPath) {
        throw new HumanloopRuntimeError(
            `Path '${filePath}' format is invalid. ` +
                `Paths must follow the standard API format 'path/to/resource' without leading or trailing slashes. ` +
                `Please use '${normalizedPath}' instead.`,
        );
    }

    // Check for file extensions
    if (fileSyncer.isFile(filePath)) {
        const pathWithoutExtension = path.join(
            path.dirname(filePath),
            path.basename(filePath, path.extname(filePath)),
        );
        throw new HumanloopRuntimeError(
            `Path '${filePath}' includes a file extension which is not supported in API calls. ` +
                `When referencing files via the \`path\` parameter, use the path without extensions: '${pathWithoutExtension}'. ` +
                `Note: File extensions are only used when pulling specific files via the CLI.`,
        );
    }

    // Check if version_id or environment is specified
    const useRemote = "versionId" in request || "environment" in request;
    if (useRemote) {
        throw new HumanloopRuntimeError(
            `Cannot use local file for \`${filePath}\` as version_id or environment was specified. ` +
                "Please either remove version_id/environment to use local files, or set use_local_files=False to use remote files.",
        );
    }

    const fileType = getFileTypeFromClient(client);
    if (!fileType || !SERIALIZABLE_FILE_TYPES.has(fileType)) {
        throw new HumanloopRuntimeError(
            `Local files are not supported for this client type: '${filePath}'.`,
        );
    }

    // If file_type is already specified in request, prioritize user-provided value
    if (fileType in request && typeof request[fileType as keyof T] !== "string") {
        console.warn(
            `Ignoring local file for \`${filePath}\` as ${fileType} parameters were directly provided. ` +
                "Using provided parameters instead.",
        );
        return request;
    }

    try {
        const fileContent = fileSyncer.getFileContent(filePath, fileType);
        return {
            ...request,
            [fileType]: fileContent,
        } as T;
    } catch (error) {
        throw new HumanloopRuntimeError(
            `Failed to use local file for \`${filePath}\`: ${error}`,
        );
    }
}

/**
 * Overloads a client with local file handling and tracing capabilities.
 * This is the preferred way to overload clients, replacing individual overloadLog and overloadCall methods.
 */
export function overloadClient<T extends ClientType>(
    client: T,
    fileSyncer?: FileSyncer,
    useLocalFiles: boolean = false,
): T {
    // Handle log method if it exists
    if ("log" in client) {
        const originalLog = (client as any).log.bind(client);
        const _overloadedLog = async (request: LogRequestType, options?: any) => {
            try {
                request = handleTracingContext(request, client);
                if (
                    useLocalFiles &&
                    (client instanceof Prompts || client instanceof Agents)
                ) {
                    if (!fileSyncer) {
                        throw new HumanloopRuntimeError(
                            "SDK initialization error: fileSyncer is missing but required for local file operations.",
                        );
                    }
                    request = handleLocalFiles(request, client, fileSyncer);
                }

                const evaluationContext = getEvaluationContext();
                if (evaluationContext !== undefined) {
                    const [kwargsEval, evalCallback] =
                        evaluationContext.logArgsWithContext({
                            logArgs: request,
                            forOtel: true,
                            path: request.path,
                        });
                    try {
                        const response = await originalLog(kwargsEval as any, options);
                        if (evalCallback !== null) {
                            await evalCallback(response.id);
                        }
                        return response;
                    } catch (error) {
                        throw new HumanloopRuntimeError(String(error));
                    }
                }
                return await originalLog(request as any, options);
            } catch (error) {
                if (error instanceof HumanloopRuntimeError) {
                    throw error;
                }
                throw new HumanloopRuntimeError(String(error));
            }
        };
        (client as any)._log = originalLog;
        (client as any).log = _overloadedLog.bind(client);
    }

    // Handle call method if it exists (for Prompts and Agents). Note that we can't use `"call" in client`
    // because Tools also have a call method.
    if (client instanceof Prompts || client instanceof Agents) {
        const originalCall = (client as any).call.bind(client);
        const _overloadedCall = async (request: PromptLogRequest, options?: any) => {
            try {
                request = handleTracingContext(request, client);
                if (useLocalFiles) {
                    if (!fileSyncer) {
                        throw new HumanloopRuntimeError(
                            "fileSyncer is required for clients that support call operations",
                        );
                    }
                    request = handleLocalFiles(request, client, fileSyncer);
                }
                return await originalCall(request, options);
            } catch (error) {
                if (error instanceof HumanloopRuntimeError) {
                    throw error;
                }
                throw new HumanloopRuntimeError(String(error));
            }
        };
        (client as any)._call = originalCall;
        (client as any).call = _overloadedCall.bind(client);
    }

    return client;
}
