import * as fs from "fs";
import * as path from "path";

/**
 * Interface for operation data
 */
interface OperationData {
    timestamp: string;
    operation_type: string;
    path: string;
    environment?: string;
    successful_files: string[];
    failed_files: string[];
    error?: string;
    duration_ms: number;
}

/**
 * Interface for metadata file structure
 */
interface MetadataFile {
    last_operation: OperationData | null;
    history: OperationData[];
}

/**
 * Parameters for the logOperation method
 */
interface LogOperationParams {
    operationType: string;
    path: string;
    environment?: string;
    successfulFiles?: string[];
    failedFiles?: string[];
    error?: string;
    duration_ms: number;
}

/**
 * Handles metadata storage and retrieval for sync operations.
 *
 * This class manages a JSON file that stores the last 5 sync operations
 * and maintains a record of the most recent operation with detailed information.
 */
export default class MetadataHandler {
    private baseDir: string;
    private metadataFile: string;
    private maxHistory: number;

    /**
     * Initialize the metadata handler.
     *
     * @param baseDir Base directory where metadata will be stored
     * @param maxHistory Maximum number of operations to keep in history
     */
    constructor(baseDir: string, maxHistory: number = 5) {
        this.baseDir = baseDir;
        this.metadataFile = path.join(baseDir, ".sync_metadata.json");
        this.maxHistory = maxHistory;
        this.ensureMetadataFile();
    }

    /**
     * Ensure the metadata file exists with proper structure.
     */
    private ensureMetadataFile(): void {
        if (!fs.existsSync(this.metadataFile)) {
            const initialData: MetadataFile = {
                last_operation: null,
                history: [],
            };
            this.writeMetadata(initialData);
        }
    }

    /**
     * Read the current metadata from file.
     */
    private readMetadata(): MetadataFile {
        try {
            const data = fs.readFileSync(this.metadataFile, "utf8");
            return JSON.parse(data) as MetadataFile;
        } catch (error) {
            console.error(`Error reading metadata file: ${error}`);
            return { last_operation: null, history: [] };
        }
    }

    /**
     * Write metadata to file.
     */
    private writeMetadata(data: MetadataFile): void {
        try {
            // Ensure directory exists
            const dir = path.dirname(this.metadataFile);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(this.metadataFile, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(`Error writing metadata file: ${error}`);
        }
    }

    /**
     * Log a sync operation.
     */
    public logOperation(params: LogOperationParams): void {
        const currentTime = new Date().toISOString();

        const operationData: OperationData = {
            timestamp: currentTime,
            operation_type: params.operationType,
            path: params.path,
            environment: params.environment,
            successful_files: params.successfulFiles || [],
            failed_files: params.failedFiles || [],
            error: params.error,
            duration_ms: params.duration_ms,
        };

        const metadata = this.readMetadata();

        // Update last operation
        metadata.last_operation = operationData;

        // Update history
        metadata.history.unshift(operationData);
        metadata.history = metadata.history.slice(0, this.maxHistory);

        this.writeMetadata(metadata);
    }

    /**
     * Get the most recent operation details.
     */
    public getLastOperation(): OperationData | null {
        const metadata = this.readMetadata();
        return metadata.last_operation;
    }

    /**
     * Get the operation history.
     */
    public getHistory(): OperationData[] {
        const metadata = this.readMetadata();
        return metadata.history;
    }
}
