import fs from "fs";
import path from "path";

/**
 * Interface for operation log entries
 */
interface OperationLog {
    operationType: string;
    path: string;
    environment?: string;
    successfulFiles?: string[];
    failedFiles?: string[];
    error?: string;
    startTime: number;
    endTime: number;
    duration: number;
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
    startTime: number;
}

/**
 * Handler for managing metadata and operation logs
 */
export default class MetadataHandler {
    private baseDir: string;
    private metadataDir: string;
    private operationsLogPath: string;

    constructor(baseDir: string) {
        this.baseDir = baseDir;
        this.metadataDir = path.join(baseDir, ".humanloop");
        this.operationsLogPath = path.join(this.metadataDir, "operations.log");

        // Create metadata directory if it doesn't exist
        if (!fs.existsSync(this.metadataDir)) {
            fs.mkdirSync(this.metadataDir, { recursive: true });
        }
    }

    /**
     * Log an operation to the operations log file
     */
    public logOperation(params: LogOperationParams): void {
        const endTime = Date.now();
        const duration = endTime - params.startTime;

        const logEntry: OperationLog = {
            ...params,
            endTime,
            duration,
        };

        try {
            // Create the log file if it doesn't exist
            if (!fs.existsSync(this.operationsLogPath)) {
                fs.writeFileSync(this.operationsLogPath, "");
            }

            // Append the log entry to the file
            fs.appendFileSync(this.operationsLogPath, JSON.stringify(logEntry) + "\n");
        } catch (error) {
            console.error(`Error logging operation: ${error}`);
        }
    }
}
