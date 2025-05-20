import { FileType } from "api";
import fs from "fs";
import path from "path";

import { HumanloopClient as BaseHumanloopClient } from "../Client";
import LRUCache from "../cache/LRUCache";
import { HumanloopRuntimeError } from "../error";
import Logger, { LogLevel } from "../utils/Logger"; // Import your existing Logger

// Default cache size for file content caching
const DEFAULT_CACHE_SIZE = 100;

export interface SyncClientOptions {
    baseDir?: string;
    cacheSize?: number;
    logLevel?: LogLevel;
}

/**
 * Format API error messages to be more user-friendly.
 */
function formatApiError(error: Error): string {
    const errorMsg = error.toString();
    
    // If the error doesn't look like an API error with status code and body
    if (!errorMsg.includes("status_code") || !errorMsg.includes("body:")) {
        return errorMsg;
    }
    
    try {
        // Extract the body part and parse as JSON
        const bodyParts = errorMsg.split("body:");
        if (bodyParts.length < 2) return errorMsg;
        
        const bodyStr = bodyParts[1].trim();
        const body = JSON.parse(bodyStr);
        
        // Get the detail from the body
        const detail = body.detail || {};
        
        // Prefer description, fall back to msg
        return detail.description || detail.msg || errorMsg;
    } catch (e) {
        Logger.debug(`Failed to parse error message: ${e}`); // Use debug level
        return errorMsg;
    }
}

/**
 * Client for managing synchronization between local filesystem and Humanloop.
 * 
 * This client provides file synchronization between Humanloop and the local filesystem,
 * with built-in caching for improved performance.
 */
export default class SyncClient {
    private client: BaseHumanloopClient;
    private baseDir: string;
    private cacheSize: number;
    private fileContentCache: LRUCache<string, string>;

    constructor(
        client: BaseHumanloopClient,
        options: SyncClientOptions = {}
    ) {
        this.client = client;
        this.baseDir = options.baseDir || "humanloop";
        this.cacheSize = options.cacheSize || DEFAULT_CACHE_SIZE;
        this.fileContentCache = new LRUCache<string, string>(this.cacheSize);
        
        // Set the log level using your Logger's setLevel method
        Logger.setLevel(options.logLevel || 'warn');
    }

    /**
     * Get the file content from cache or filesystem.
     */
    public getFileContent(filePath: string, fileType: FileType): string {
        const cacheKey = `${filePath}:${fileType}`;
        
        // Check if in cache
        const cachedContent = this.fileContentCache.get(cacheKey);
        if (cachedContent !== undefined) {
            // Use debug level for cache hits
            Logger.debug(`Using cached file content for ${filePath}.${fileType}`);
            return cachedContent;
        }
        
        // Not in cache, get from filesystem
        const localPath = path.join(this.baseDir, `${filePath}.${fileType}`);
        
        if (!fs.existsSync(localPath)) {
            throw new HumanloopRuntimeError(`Local file not found: ${localPath}`);
        }
        
        try {
            const fileContent = fs.readFileSync(localPath, 'utf8');
            Logger.debug(`Using local file content from ${localPath}`);
            
            // Add to cache
            this.fileContentCache.set(cacheKey, fileContent);
            
            return fileContent;
        } catch (error) {
            throw new HumanloopRuntimeError(
                `Error reading local file ${localPath}: ${error}`
            );
        }
    }

    /**
     * Clear the cache.
     */
    public clearCache(): void {
        this.fileContentCache.clear();
    }

    /**
     * Normalize the path by removing extensions, etc.
     */
    private normalizePath(filePath: string): string {
        if (!filePath) return "";
        
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
     * Save serialized file to local filesystem.
     */
    private saveSerializedFile(
        serializedContent: string, 
        filePath: string, 
        fileType: FileType
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
        } catch (error) {
            Logger.error(`Failed to sync ${fileType} ${filePath}: ${error}`);
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
        
        this.saveSerializedFile(file.rawFileContent!, file.path, file.type);
    }

    /**
     * Pull all files from a directory in Humanloop to local filesystem.
     */
    private async pullDirectory(
        path?: string,
        environment?: string,
    ): Promise<string[]> {
        const successfulFiles: string[] = [];
        const failedFiles: string[] = [];
        let page = 1;
        
        Logger.debug(`Fetching files from directory: ${path || '(root)'} in environment: ${environment || '(default)'}`);
        
        while (true) {
            try {
                Logger.debug(`Requesting page ${page} of files`);
                
                const response = await this.client.files.listFiles({
                    type: ["prompt", "agent"],
                    page,
                    includeRawFileContent: true,
                    environment,
                    path,
                });
                
                if (response.records.length === 0) {
                    Logger.debug("No more files found");
                    break;
                }
                
                Logger.debug(`Found ${response.records.length} files from page ${page}`);
                
                // Process each file
                for (const file of response.records) {
                    // Skip if not a Prompt or Agent
                    if (file.type !== "prompt" && file.type !== "agent") {
                        Logger.warn(`Skipping unsupported file type: ${file.type}`);
                        continue;
                    }
                    
                    // Skip if no raw file content
                    if (!file.rawFileContent) {
                        Logger.warn(`No content found for ${file.type} ${file.id || "<unknown>"}`);
                        continue;
                    }
                    
                    try {
                        Logger.debug(`Saving ${file.type} ${file.path}`);
                        
                        this.saveSerializedFile(
                            file.rawFileContent,
                            file.path,
                            file.type,
                        );
                        successfulFiles.push(file.path);
                    } catch (error) {
                        failedFiles.push(file.path);
                        Logger.error(`Task failed for ${file.path}: ${error}`);
                    }
                }
                
                page += 1;
            } catch (error) {
                const formattedError = formatApiError(error as Error);
                throw new HumanloopRuntimeError(
                    `Failed to pull files: ${formattedError}`
                );
            }
        }
        
        if (successfulFiles.length > 0) {
            Logger.info(`Successfully pulled ${successfulFiles.length} files`);
        }
        if (failedFiles.length > 0) {
            Logger.warn(`Failed to pull ${failedFiles.length} files`);
        }
        
        return successfulFiles;
    }

    /**
     * Pull files from Humanloop to local filesystem.
     */
    public async pull(path?: string, environment?: string): Promise<string[]> {
        const startTime = Date.now();
        const normalizedPath = path ? this.normalizePath(path) : undefined;
        
        Logger.info(`Starting pull operation: path=${normalizedPath || '(root)'}, environment=${environment || '(default)'}`);
        
        let successfulFiles: string[] = [];
        
        if (!path) {
            // Pull all files from the root
            Logger.debug("Pulling all files from root");
            successfulFiles = await this.pullDirectory(undefined, environment);
        } else {
            if (this.isFile(path)) {
                Logger.debug(`Pulling specific file: ${normalizedPath}`);
                await this.pullFile(normalizedPath!, environment);
                successfulFiles = [path];
            } else {
                Logger.debug(`Pulling directory: ${normalizedPath}`);
                successfulFiles = await this.pullDirectory(
                    normalizedPath,
                    environment,
                );
            }
        }
        
        const duration = Date.now() - startTime;
        Logger.success(`Pull completed in ${duration}ms: ${successfulFiles.length} files succeeded`);
    
        return successfulFiles;
    }
}