/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * @example
 *     {}
 */
export interface ToolLogUpdateRequest {
    /** Generated output from your model for the provided inputs. Can be `None` if logging an error, or if creating a parent Log with the intention to populate it later. */
    output?: string;
    /** User defined timestamp for when the log was created. */
    createdAt?: Date;
    /** Error message if the log is an error. */
    error?: string;
    /** Duration of the logged event in seconds. */
    providerLatency?: number;
    /** Captured log and debug statements. */
    stdout?: string;
    /** Raw request sent to provider. */
    providerRequest?: Record<string, unknown>;
    /** Raw response received the provider. */
    providerResponse?: Record<string, unknown>;
    /** The inputs passed to the prompt template. */
    inputs?: Record<string, unknown>;
    /** Identifies where the model was called from. */
    source?: string;
    /** Any additional metadata to record. */
    metadata?: Record<string, unknown>;
    /** When the logged event started. */
    startTime?: Date;
    /** When the logged event ended. */
    endTime?: Date;
}
