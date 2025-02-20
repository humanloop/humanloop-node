/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * Specification of a File version on Humanloop.
 *
 * This can be done in a couple of ways:
 * - Specifying `version_id` directly.
 * - Specifying a File (and optionally an Environment).
 *     - A File can be specified by either `path` or `file_id`.
 *     - An Environment can be specified by `environment_id`. If no Environment is specified, the default Environment is used.
 */
export interface EvaluateeRequest {
    /** Unique identifier for the File Version. If provided, none of the other fields should be specified. */
    versionId?: string;
    /** Path identifying a File. Provide either this or `file_id` if you want to specify a File. */
    path?: string;
    /** Unique identifier for the File. Provide either this or `path` if you want to specify a File. */
    fileId?: string;
    /** Name of the Environment a Version is deployed to. Only provide this when specifying a File. If not provided (and a File is specified), the default Environment is used. */
    environment?: string;
    /** Unique identifier for the batch of Logs to include in the Evaluation. */
    batchId?: string;
    /** Whether the Prompt/Tool is orchestrated by Humanloop. Default is `True`. If `False`, a log for the Prompt/Tool should be submitted by the user via the API. */
    orchestrated?: boolean;
}
