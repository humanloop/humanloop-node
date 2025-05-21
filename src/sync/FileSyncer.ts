import { FileType } from "api";
import fs from "fs";
import path from "path";

import * as pathUtils from "../pathUtils";
import LRUCache from "../cache/LRUCache";
import { HumanloopRuntimeError } from "../error";
import { HumanloopClient } from "../humanloop.client";

// Default cache size for file content caching
const DEFAULT_CACHE_SIZE = 100;

// File types that can be serialized to/from the filesystem
export type SerializableFileType = "prompt" | "agent";
export const SERIALIZABLE_FILE_TYPES = new Set<SerializableFileType>([
    "prompt",
    "agent",
]);

export interface FileSyncerOptions {
    baseDir?: string;
    cacheSize?: number;
    verbose?: boolean;
}

// Simple logging with color and verbosity control
const LogType = {
    DEBUG: "\x1b[90m", // gray
    INFO: "\x1b[96m", // cyan
    WARN: "\x1b[93m", // yellow
    ERROR: "\x1b[91m", // red
    RESET: "\x1b[0m",
} as const;

function log(
    message: string,
    type: keyof typeof LogType,
    verbose: boolean = false,
): void {
    // Only show debug/info if verbose is true
    if ((type === "DEBUG" || type === "INFO") && !verbose) return;
    console.log(`${LogType[type]}${message}${LogType.RESET}`);
}

/**
 * Format API error messages to be more user-friendly.
 */
function formatApiError(error: Error, verbose: boolean = false): string {
    const errorMsg = error.message || String(error);
    try {
        const detail = JSON.parse(errorMsg);
        if (typeof detail === "string") {
            return detail;
        } else if (typeof detail === "object") {
            return detail.description || detail.msg || errorMsg;
        }
        return errorMsg;
    } catch (e) {
        log(`Failed to parse error message: ${e}`, "DEBUG", verbose);
        return errorMsg;
    }
}

/**
 * Client for synchronizing Prompt and Agent files between Humanloop workspace and local filesystem.
 *
 * This client enables a local development workflow by:
 * 1. Pulling files from Humanloop workspace to local filesystem
 * 2. Maintaining the same directory structure locally as in Humanloop
 * 3. Storing files in human-readable, version-control friendly formats (.prompt and .agent)
 * 4. Supporting local file access in the SDK when configured with use_local_files=true
 *
 * Files maintain their relative paths from the Humanloop workspace (with appropriate extensions added),
 * allowing for seamless reference between local and remote environments using the same path identifiers.
 */
export default class FileSyncer {
    // Default page size for API pagination when listing Files
    private static readonly PAGE_SIZE = 100;

    private readonly client: HumanloopClient;
    private readonly baseDir: string;
    private readonly cacheSize: number;
    private readonly fileContentCache: LRUCache<string, string>;
    private readonly verbose: boolean;

    constructor(client: HumanloopClient, options: FileSyncerOptions = {}) {
        this.client = client;
        this.baseDir = options.baseDir || "humanloop";
        this.cacheSize = options.cacheSize || DEFAULT_CACHE_SIZE;
        this.fileContentCache = new LRUCache<string, string>(this.cacheSize);
        this.verbose = options.verbose || false;
    }

    /**
     * Implementation of get_file_content without the cache decorator.
     *
     * This is the actual implementation that gets wrapped by LRU cache.
     *
     * @param filePath The API path to the file (e.g. `path/to/file`)
     * @param fileType The type of file to get the content of (SerializableFileType)
     * @returns The raw file content
     * @throws HumanloopRuntimeError If the file doesn't exist or can't be read
     */
    private _getFileContentImplementation(
        filePath: string,
        fileType: SerializableFileType,
    ): string {
        const fullPath = path.join(this.baseDir, `${filePath}.${fileType}`);
        try {
            // Read the raw file content
            const fileContent = fs.readFileSync(fullPath, "utf8");
            log(`Using local file content from ${fullPath}`, "DEBUG", this.verbose);
            return fileContent;
        } catch (error) {
            throw new HumanloopRuntimeError(
                `Failed to read ${fileType} ${filePath} from disk: ${error}`,
            );
        }
    }

    /**
     * Get the raw file content of a file from cache or filesystem.
     *
     * This method uses an LRU cache to store file contents. When the cache is full,
     * the least recently accessed files are automatically removed to make space.
     *
     * @param filePath The normalized path to the file (without extension)
     * @param fileType The type of file (Prompt or Agent)
     * @returns The raw file content
     * @throws HumanloopRuntimeError If the file doesn't exist or can't be read
     */
    public getFileContent(filePath: string, fileType: SerializableFileType): string {
        const cacheKey = `${filePath}:${fileType}`;

        // Check if in cache
        const cachedContent = this.fileContentCache.get(cacheKey);
        if (cachedContent !== undefined) {
            log(
                `Using cached file content for ${filePath}.${fileType}`,
                "DEBUG",
                this.verbose,
            );
            return cachedContent;
        }

        // Not in cache, get from filesystem
        const content = this._getFileContentImplementation(filePath, fileType);

        // Add to cache
        this.fileContentCache.set(cacheKey, content);

        return content;
    }

    /**
     * Clear the LRU cache.
     */
    public clearCache(): void {
        this.fileContentCache.clear();
    }

    /**
     * Check if the path is a file by checking for .{fileType} extension for serializable file types.
     *
     * Files are identified by having a supported extension (.prompt or .agent).
     * This method performs case-insensitive comparison and handles whitespace.
     *
     * @returns True if the path ends with a supported file extension
     */
    public isFile(filePath: string): boolean {
        const cleanPath = filePath.trim().toLowerCase(); // Convert to lowercase for case-insensitive comparison
        return Array.from(SERIALIZABLE_FILE_TYPES).some((fileType) =>
            cleanPath.endsWith(`.${fileType}`),
        );
    }

    /**
     * Save serialized file to local filesystem.
     */
    private _saveSerializedFile(
        serializedContent: string,
        filePath: string,
        fileType: SerializableFileType,
    ): void {
        try {
            // Create full path including baseDir prefix
            const fullPath = path.join(this.baseDir, filePath);
            const directory = path.dirname(fullPath);
            const fileName = path.basename(fullPath, path.extname(fullPath));

            // Create directory if it doesn't exist
            fs.mkdirSync(directory, { recursive: true });

            // Add file type extension
            const newPath = path.join(directory, `${fileName}.${fileType}`);

            // Write raw file content to file
            fs.writeFileSync(newPath, serializedContent);
            log(`Writing ${fileType} ${filePath} to disk`, "DEBUG", this.verbose);
        } catch (error) {
            log(`Failed to write ${fileType} ${filePath} to disk: ${error}`, "ERROR");
            throw error;
        }
    }

    /**
     * Pull a specific file from Humanloop to local filesystem.
     *
     * @returns True if the file was successfully pulled, False otherwise (e.g. if the file was not found)
     */
    private async _pullFile(filePath: string, environment?: string): Promise<boolean> {
        try {
            const file = await this.client.files.retrieveByPath({
                path: filePath,
                environment,
                includeRawFileContent: true,
            });

            if (!SERIALIZABLE_FILE_TYPES.has(file.type as SerializableFileType)) {
                log(`Unsupported file type: ${file.type}`, "ERROR");
                return false;
            }

            const rawContent = (file as any).rawFileContent;
            if (!rawContent) {
                log(`No content found for ${file.type} ${filePath}`, "ERROR");
                return false;
            }

            this._saveSerializedFile(
                rawContent,
                file.path,
                file.type as SerializableFileType,
            );
            return true;
        } catch (error) {
            log(`Failed to pull file ${filePath}: ${error}`, "ERROR");
            return false;
        }
    }

    /**
     * Sync Prompt and Agent files from Humanloop to local filesystem.
     *
     * @returns An array containing two string arrays:
     * - First array contains paths of successfully pulled files
     * - Second array contains paths of files that failed to pull.
     *   Failures can occur due to missing content in the response or errors during local file writing.
     * @throws HumanloopRuntimeError If there's an error communicating with the API
     */
    private async _pullDirectory(
        dirPath?: string,
        environment?: string,
    ): Promise<[string[], string[]]> {
        const successfulFiles: string[] = [];
        const failedFiles: string[] = [];
        let page = 1;
        let totalPages = 0;

        log(
            `Fetching files from ${dirPath || "root"} (environment: ${environment || "default"})`,
            "INFO",
            this.verbose,
        );

        while (true) {
            try {
                const response = await this.client.files.listFiles({
                    type: Array.from(SERIALIZABLE_FILE_TYPES),
                    page,
                    size: FileSyncer.PAGE_SIZE,
                    includeRawFileContent: true,
                    environment,
                    path: dirPath,
                });

                // Calculate total pages on first response
                if (page === 1) {
                    const actualPageSize = response.size || FileSyncer.PAGE_SIZE;
                    totalPages = Math.ceil(response.total / actualPageSize);
                }

                if (response.records.length === 0) {
                    break;
                }

                log(
                    `Reading page ${page}/${totalPages} (${response.records.length} Files)`,
                    "DEBUG",
                    this.verbose,
                );

                // Process each file
                for (const file of response.records) {
                    if (
                        !SERIALIZABLE_FILE_TYPES.has(file.type as SerializableFileType)
                    ) {
                        log(`Skipping unsupported file type: ${file.type}`, "WARN");
                        continue;
                    }

                    const fileType = file.type as SerializableFileType;
                    const rawContent = (file as any).rawFileContent;
                    if (!rawContent) {
                        log(`No content found for ${file.type} ${file.path}`, "WARN");
                        failedFiles.push(file.path);
                        continue;
                    }

                    try {
                        this._saveSerializedFile(rawContent, file.path, fileType);
                        successfulFiles.push(file.path);
                    } catch (error) {
                        failedFiles.push(file.path);
                        log(`Failed to save ${file.path}: ${error}`, "ERROR");
                    }
                }

                // Check if we've reached the last page
                if (page >= totalPages) {
                    break;
                }
                page += 1;
            } catch (error) {
                const formattedError = formatApiError(error as Error, this.verbose);
                throw new HumanloopRuntimeError(
                    `Failed to fetch page ${page}: ${formattedError}`,
                );
            }
        }

        if (failedFiles.length > 0) {
            log(`Failed to pull ${failedFiles.length} files`, "WARN");
        }

        return [successfulFiles, failedFiles];
    }

    /**
     * Pull files from Humanloop to local filesystem.
     *
     * If the path ends with `.prompt` or `.agent`, pulls that specific file.
     * Otherwise, pulls all files under the specified path.
     * If no path is provided, pulls all files from the root.
     *
     * @param filePath The path to pull from. Can be:
     * - A specific file with extension (e.g. "path/to/file.prompt")
     * - A directory without extension (e.g. "path/to/directory")
     * - None to pull all files from root
     *
     * Paths should not contain leading or trailing slashes
     * @param environment The environment to pull from
     * @returns An array containing two string arrays:
     * - First array contains paths of successfully pulled files
     * - Second array contains paths of files that failed to pull (e.g. failed to write to disk or missing raw content)
     * @throws HumanloopRuntimeError If there's an error communicating with the API
     */
    public async pull(
        filePath?: string,
        environment?: string,
    ): Promise<[string[], string[]]> {
        const startTime = Date.now();

        let apiPath: string | undefined;
        let isFilePath: boolean;

        if (filePath === undefined) {
            apiPath = undefined;
            isFilePath = false;
        } else {
            filePath = filePath.trim();
            // Check if path has leading/trailing slashes
            if (filePath !== filePath.trim().replace(/^\/+|\/+$/g, "")) {
                throw new HumanloopRuntimeError(
                    `Invalid path: ${filePath}. Path should not contain leading/trailing slashes. ` +
                        `Valid examples: "path/to/file.prompt" or "path/to/directory"`,
                );
            }

            // Check if it's a file path (has extension)
            isFilePath = this.isFile(filePath);

            // For API communication, we need path without extension
            apiPath = pathUtils.normalizePath(filePath, true);
        }

        try {
            let successfulFiles: string[];
            let failedFiles: string[];

            if (apiPath === undefined) {
                [successfulFiles, failedFiles] = await this._pullDirectory(
                    undefined,
                    environment,
                );
            } else {
                if (isFilePath) {
                    if (await this._pullFile(apiPath, environment)) {
                        successfulFiles = [apiPath];
                        failedFiles = [];
                    } else {
                        successfulFiles = [];
                        failedFiles = [apiPath];
                    }
                } else {
                    [successfulFiles, failedFiles] = await this._pullDirectory(
                        apiPath,
                        environment,
                    );
                }
            }

            // Clear the cache at the end of each pull operation
            this.clearCache();

            const duration = Date.now() - startTime;
            log(
                `Successfully pulled ${successfulFiles.length} files in ${duration}ms`,
                "INFO",
                this.verbose,
            );

            return [successfulFiles, failedFiles];
        } catch (error) {
            throw new HumanloopRuntimeError(`Pull operation failed: ${error}`);
        }
    }
}
