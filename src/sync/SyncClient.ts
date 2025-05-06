import { FileType } from "api";
import fs from "fs";
import path from "path";

import { HumanloopClient as BaseHumanloopClient } from "../Client";
import LRUCache from "../cache/LRUCache";
import { HumanloopRuntimeError } from "../error";
import MetadataHandler from "./MetadataHandler";

// Default cache size for file content caching
const DEFAULT_CACHE_SIZE = 100;

/**
 * Internal client for managing synchronization between local filesystem and Humanloop.
 */
export default class SyncClient {
    private client: BaseHumanloopClient;
    private baseDir: string;
    private cacheSize: number;
    private fileContentCache: LRUCache<string, string>;
    private metadata: MetadataHandler;

    constructor(
        client: BaseHumanloopClient,
        baseDir: string = "humanloop",
        cacheSize: number = DEFAULT_CACHE_SIZE,
    ) {
        this.client = client;
        this.baseDir = baseDir;
        this.cacheSize = cacheSize;
        this.fileContentCache = new LRUCache<string, string>(cacheSize);
        this.metadata = new MetadataHandler(this.baseDir);
    }

    /**
     * Get the raw file content of a file from cache or filesystem.
     */
    private getFileContent(path: string, fileType: FileType): string {
        const cacheKey = `${path}:${fileType}`;

        // Check if the content is in the cache
        const cachedContent = this.fileContentCache.get(cacheKey);
        if (cachedContent !== undefined) {
            console.debug(`Using cached file content for ${path}.${fileType}`);
            return cachedContent;
        }

        // If not in cache, get from filesystem
        const content = this.getFileContentImpl(path, fileType);

        // Store in cache
        this.fileContentCache.set(cacheKey, content);

        return content;
    }

    /**
     * Implementation of getFileContent without the cache.
     */
    private getFileContentImpl(path: string, fileType: FileType): string {
        // Construct path to local file
        const localPath = this.getFullPath(path, fileType);

        if (!fs.existsSync(localPath)) {
            throw new HumanloopRuntimeError(`Local file not found: ${localPath}`);
        }

        try {
            // Read the raw file content
            const fileContent = fs.readFileSync(localPath, "utf8");
            console.debug(`Using local file content from ${localPath}`);
            return fileContent;
        } catch (error) {
            throw new HumanloopRuntimeError(
                `Error reading local file ${localPath}: ${error}`,
            );
        }
    }

    /**
     * Clear the LRU cache.
     */
    private clearCache(): void {
        this.fileContentCache.clear();
    }

    /**
     * Normalize the path by:
     * 1. Removing any file extensions (.prompt, .agent)
     * 2. Converting backslashes to forward slashes
     * 3. Removing leading and trailing slashes
     * 4. Removing leading and trailing whitespace
     * 5. Normalizing multiple consecutive slashes into a single forward slash
     */
    private normalizePath(filePath: string): string {
        // Remove any file extensions
        let normalizedPath = filePath.includes(".")
            ? filePath.substring(0, filePath.lastIndexOf("."))
            : filePath;

        // Convert backslashes to forward slashes
        normalizedPath = normalizedPath.replace(/\\/g, "/");

        // Remove leading/trailing whitespace and slashes
        normalizedPath = normalizedPath.trim().replace(/^\/+|\/+$/g, "");

        // Normalize multiple consecutive slashes into a single forward slash
        while (normalizedPath.includes("//")) {
            normalizedPath = normalizedPath.replace(/\/\//g, "/");
        }

        return normalizedPath;
    }

    /**
     * Check if the path is a file by checking for .prompt or .agent extension.
     */
    private isFile(path: string): boolean {
        return path.trim().endsWith(".prompt") || path.trim().endsWith(".agent");
    }

    /**
     * Get the full path to a file, including extension.
     */
    private getFullPath(filePath: string, fileType: FileType): string {
        const normalizedPath = path.join(this.baseDir, filePath);
        const directory = path.dirname(normalizedPath);
        const fileName = path.basename(normalizedPath);
        return path.join(directory, `${fileName}.${fileType}`);
    }

    /**
     * Save serialized file to local filesystem.
     */
    private saveSerializedFile(
        serializedContent: string,
        filePath: string,
        fileType: FileType,
    ): void {
        try {
            // Create full path including baseDir prefix
            const fullPath = path.join(this.baseDir, filePath);
            const directory = path.dirname(fullPath);
            const fileName = path.basename(fullPath);

            // Create directory if it doesn't exist
            fs.mkdirSync(directory, { recursive: true });

            // Add file type extension
            const newPath = path.join(directory, `${fileName}.${fileType}`);

            // Write raw file content to file
            fs.writeFileSync(newPath, serializedContent);

            // Clear the cache for this file to ensure we get fresh content next time
            this.clearCache();

            console.info(`Syncing ${fileType} ${filePath}`);
        } catch (error) {
            console.error(`Failed to sync ${fileType} ${filePath}: ${error}`);
            throw error;
        }
    }

    /**
     * Pull a specific file from Humanloop to local filesystem.
     */
    private async pullFile(path: string, environment?: string): Promise<void> {
        const file = await this.client.files.retrieveByPath({
            path,
            environment,
            includeRawFileContent: true,
        });

        if (file.type !== "prompt" && file.type !== "agent") {
            throw new Error(`Unsupported file type: ${file.type}`);
        }

        this.saveSerializedFile((file as any).rawFileContent, file.path, file.type);
    }

    /**
     * Sync Prompt and Agent files from Humanloop to local filesystem.
     */
    private async pullDirectory(
        path?: string,
        environment?: string,
    ): Promise<string[]> {
        const successfulFiles: string[] = [];
        const failedFiles: string[] = [];
        let page = 1;   

        while (true) {
            try {
                const response = await this.client.files.listFiles({
                    type: ["prompt", "agent"],
                    page,
                    includeRawFileContent: true,
                    environment,
                    path,
                });
                console.log(response);

                if (response.records.length === 0) {
                    break;
                }

                // Process each file
                for (const file of response.records) {
                    // Skip if not a Prompt or Agent
                    if (file.type !== "prompt" && file.type !== "agent") {
                        console.warn(`Skipping unsupported file type: ${file.type}`);
                        continue;
                    }

                    // Skip if no raw file content
                    if (!(file as any).rawFileContent) {
                        console.warn(
                            `No content found for ${file.type} ${file.id || "<unknown>"}`,
                        );
                        continue;
                    }

                    try {
                        this.saveSerializedFile(
                            (file as any).rawFileContent,
                            file.path,
                            file.type,
                        );
                        successfulFiles.push(file.path);
                    } catch (error) {
                        failedFiles.push(file.path);
                        console.error(`Task failed for ${file.path}: ${error}`);
                    }
                }

                page += 1;
            } catch (error) {
                throw new HumanloopRuntimeError(
                    `Failed to fetch page ${page}: ${error}`,
                );
            }
        }

        // Log summary only if we have results
        if (successfulFiles.length > 0 || failedFiles.length > 0) {
            if (successfulFiles.length > 0) {
                console.info(`\nSynced ${successfulFiles.length} files`);
            }
            if (failedFiles.length > 0) {
                console.error(`Failed to sync ${failedFiles.length} files`);
            }
        }

        return successfulFiles;
    }

    /**
     * Pull files from Humanloop to local filesystem.
     *
     * @param path - The path to the file or directory to pull.
     * @param environment - The environment to pull the file from.
     * @returns An array of successful file paths.
     */
    public async pull(path?: string, environment?: string): Promise<string[]> {
        const startTime = Date.now();
        try {
            let successfulFiles: string[] = [];
            let failedFiles: string[] = [];

            if (!path) {
                // Pull all files from the root
                successfulFiles = await this.pullDirectory(undefined, environment);
            } else {
                const normalizedPath = this.normalizePath(path);
                if (this.isFile(path)) {
                    await this.pullFile(normalizedPath, environment);
                    successfulFiles = [path];
                } else {
                    successfulFiles = await this.pullDirectory(
                        normalizedPath,
                        environment,
                    );
                }
            }

            // Log the successful operation
            this.metadata.logOperation({
                operationType: "pull",
                path: path || "", // Use empty string if path is undefined
                environment,
                successfulFiles,
                failedFiles,
                startTime,
            });

            return successfulFiles;
        } catch (error) {
            // Log the failed operation
            this.metadata.logOperation({
                operationType: "pull",
                path: path || "", // Use empty string if path is undefined
                environment,
                error: String(error),
                startTime,
            });
            throw error;
        }
    }
}
