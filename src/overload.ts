import path from "path";

import {
    CreateEvaluatorLogRequest,
    FileType,
    FlowLogRequest,
    PromptLogRequest,
    ToolLogRequest,
} from "./api";
import { Agents } from "./api/resources/agents/client/Client";
import { Datasets } from "./api/resources/datasets/client/Client";
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

type ClientType = Flows | Agents | Prompts | Tools | Evaluators | Datasets;
type LogRequestType =
    | FlowLogRequest
    | PromptLogRequest
    | ToolLogRequest
    | CreateEvaluatorLogRequest;

/**
 * Get the file type based on the client type.
 * 
 * @param client Client instance to check
 * @returns The file type corresponding to the client, or null if not a file type that supports local files
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
    } else if (client instanceof Datasets) {
        return null; // Datasets don't support local files
    } else {
        throw new HumanloopRuntimeError(
            // @ts-ignore Client shouldn't be of a type other than those checked above, but included as a safeguard
            `Unsupported client type: ${client.constructor.name}`,
        );
    }
}

/**
 * Handle tracing context for both log and call methods.
 * 
 * @param request The API request
 * @param client The client making the request
 * @returns The updated request with tracing context applied
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
                `Using \`flows.log()\` is not allowed: Flow decorator ` +
                `for File ${context.path} manages the tracing and trace completion.`,
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
 * Load prompt/agent file content from local filesystem into API request.
 *
 * Retrieves the file content at the specified path and adds it to request
 * under the appropriate field ('prompt' or 'agent'), allowing local files
 * to be used in API calls instead of fetching from Humanloop API.
 *
 * @param request API request object
 * @param client Client instance making the call
 * @param fileSyncer FileSyncer handling local file operations
 * @returns Updated request with file content in the appropriate field
 * @throws HumanloopRuntimeError On validation or file loading failures.
 *   For example, an invalid path format (absolute paths, leading/trailing slashes, etc.) 
 *   or a file not being found.
 */
function handleLocalFiles<T extends LogRequestType>(
    request: T,
    client: ClientType,
    fileSyncer: FileSyncer,
): T {
    // Validate request has either id or path, but not both
    if ("id" in request && "path" in request) {
        throw new HumanloopRuntimeError("Can only specify one of `id` or `path`");
    }
    if (!("id" in request) && !("path" in request)) {
        throw new HumanloopRuntimeError("Must specify either `id` or `path`");
    }

    // If using id, we can't use local files
    if ("id" in request) {
        return request;
    }

    const filePath = request.path?.trim();
    if (!filePath) {
        throw new HumanloopRuntimeError("Path cannot be empty");
    }

    // First check for path format issues (absolute paths or leading/trailing slashes)
    const normalizedPath = filePath.trim().replace(/^\/+|\/+$/g, "");
    if (path.isAbsolute(filePath) || filePath !== normalizedPath) {
        throw new HumanloopRuntimeError(
            `Path '${filePath}' format is invalid. ` +
            `Paths must follow the standard API format 'path/to/resource' without leading or trailing slashes. ` +
            `Please use '${normalizedPath}' instead.`,
        );
    }

    // Then check for file extensions
    if (fileSyncer.isFile(filePath)) {
        const pathWithoutExtension = path.join(
            path.dirname(filePath),
            path.basename(filePath, path.extname(filePath)),
        );
        throw new HumanloopRuntimeError(
            `Path '${filePath}' should not include any file extensions in API calls. ` +
            `When referencing files via the \`path\` parameter, use the path without extensions: '${pathWithoutExtension}'. ` +
            `Note: File extensions are only used when pulling specific files via the CLI.`,
        );
    }

    // Check if version_id or environment is specified
    const useRemote = "versionId" in request || "environment" in request;
    if (useRemote) {
        throw new HumanloopRuntimeError(
            `Cannot use local file for \`${filePath}\` as version_id or environment was specified. ` +
            `Please either remove version_id/environment to use local files, or set use_local_files=False to use remote files.`,
        );
    }

    const fileType = getFileTypeFromClient(client);
    if (!fileType || !SERIALIZABLE_FILE_TYPES.has(fileType)) {
        throw new HumanloopRuntimeError(
            `Local files are not supported for \`${fileType?.charAt(0).toUpperCase()}${fileType?.slice(1)}\` files: '${filePath}'.`,
        );
    }

    // If file_type is already specified in request, prioritize user-provided value
    if (fileType in request && typeof request[fileType as keyof T] !== "string") {
        console.warn(
            `Ignoring local file for \`${filePath}\` as ${fileType} parameters were directly provided. ` +
            `Using provided parameters instead.`,
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
 * Handle evaluation context for logging.
 * 
 * @param request The API request
 * @returns Tuple of [updated request, callback function]
 */
function handleEvaluationContext<T extends LogRequestType>(
    request: T,
): [T, ((id: string) => Promise<void>) | null] {
    const evaluationContext = getEvaluationContext();
    if (evaluationContext !== undefined) {
        const [newRequest, callback] = evaluationContext.logArgsWithContext({
            logArgs: request,
            forOtel: true,
            path: request.path,
        });
        return [newRequest as T, callback];
    }
    return [request, null];
}

/**
 * Overloaded log method implementation.
 * Handles tracing context, local file loading, and evaluation context.
 * 
 * @param self The client instance
 * @param fileSyncer Optional FileSyncer for local file operations
 * @param useLocalFiles Whether to use local files
 * @param request The log request
 * @param options Additional options
 * @returns The log response
 */
async function overloadedLog<T extends ClientType>(
    self: T,
    fileSyncer: FileSyncer | undefined,
    useLocalFiles: boolean,
    request: LogRequestType,
    options?: any,
) {
    try {
        // Special handling for flows - prevent direct log usage
        if (self instanceof Flows && getTraceId() !== undefined) {
            const context = getDecoratorContext();
            if (context === undefined) {
                throw new HumanloopRuntimeError(
                    "Internal error: trace_id context is set outside a decorator context.",
                );
            }
            throw new HumanloopRuntimeError(
                `Using \`flows.log()\` is not allowed: Flow decorator ` +
                `for File ${context.path} manages the tracing and trace completion.`,
            );
        }

        request = handleTracingContext(request, self);

        // Handle loading files from local filesystem when using Prompt and Agent clients
        if (
            useLocalFiles &&
            (self instanceof Prompts || self instanceof Agents)
        ) {
            if (!fileSyncer) {
                throw new HumanloopRuntimeError(
                    "SDK initialization error: fileSyncer is missing but required for local file operations. " +
                    "This is likely a bug in the SDK initialization - please report this issue to the Humanloop team.",
                );
            }
            request = handleLocalFiles(request, self, fileSyncer);
        }

        const [evalRequest, evalCallback] = handleEvaluationContext(request);
        const response = await (self as any)._log(evalRequest, options);
        
        if (evalCallback !== null) {
            await evalCallback(response.id);
        }
        return response;
    } catch (error) {
        if (error instanceof HumanloopRuntimeError) {
            throw error;
        }
        throw new HumanloopRuntimeError(String(error));
    }
}

/**
 * Overloaded call method implementation.
 * Handles tracing context and local file loading.
 * 
 * @param self The client instance
 * @param fileSyncer Optional FileSyncer for local file operations
 * @param useLocalFiles Whether to use local files
 * @param request The call request
 * @param options Additional options
 * @returns The call response
 */
async function overloadedCall<T extends ClientType>(
    self: T,
    fileSyncer: FileSyncer | undefined,
    useLocalFiles: boolean,
    request: any,
    options?: any,
) {
    try {
        request = handleTracingContext(request, self);
        
        // If `useLocalFiles` flag is True, we should use local file content for
        // `call` operations on Prompt and Agent clients.
        if (useLocalFiles && (self instanceof Prompts || self instanceof Agents)) {
            if (!fileSyncer) {
                throw new HumanloopRuntimeError(
                    "fileSyncer is required for clients that support call operations",
                );
            }
            request = handleLocalFiles(request, self, fileSyncer);
        }
        
        return await (self as any)._call(request, options);
    } catch (error) {
        if (error instanceof HumanloopRuntimeError) {
            throw error;
        }
        throw new HumanloopRuntimeError(String(error));
    }
}

/**
 * Overloads client methods to add tracing, local file handling, and evaluation context.
 * 
 * This function enhances clients by:
 * 1. Adding tracing context to requests for Flow integration
 * 2. Supporting local file loading for Prompt and Agent clients
 * 3. Handling evaluation context for logging
 * 
 * @param client The client to overload
 * @param fileSyncer Optional FileSyncer for local file operations
 * @param useLocalFiles Whether to use local files (default: false)
 * @returns The overloaded client
 * @throws HumanloopRuntimeError If fileSyncer is missing but required
 */
export function overloadClient<T extends ClientType>(
    client: T,
    fileSyncer?: FileSyncer,
    useLocalFiles: boolean = false,
): T {
    // Handle log method if it exists
    if ("log" in client) {
        const originalLog = (client as any).log.bind(client);
        (client as any)._log = originalLog;
        (client as any).log = async (request: LogRequestType, options?: any) => {
            return overloadedLog(client, fileSyncer, useLocalFiles, request, options);
        };
    }

    // Handle call method if it exists (for Prompts and Agents)
    if (client instanceof Prompts || client instanceof Agents) {
        // Verify fileSyncer is provided if needed
        if (fileSyncer === undefined && useLocalFiles) {
            console.error("fileSyncer is undefined but client has call method and useLocalFiles=%s", useLocalFiles);
            throw new HumanloopRuntimeError("fileSyncer is required for clients that support call operations");
        }
        
        const originalCall = (client as any).call.bind(client);
        (client as any)._call = originalCall;
        (client as any).call = async (request: any, options?: any) => {
            return overloadedCall(client, fileSyncer, useLocalFiles, request, options);
        };
    }

    return client;
}