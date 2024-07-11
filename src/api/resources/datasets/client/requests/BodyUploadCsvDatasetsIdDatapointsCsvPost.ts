/**
 * This file was auto-generated by Fern from our API Definition.
 */

/**
 * @example
 *     {
 *         commitMessage: "commit_message"
 *     }
 */
export interface BodyUploadCsvDatasetsIdDatapointsCsvPost {
    /**
     * ID of the specific Dataset version to base the created Version on.
     */
    versionId?: string;
    /**
     * Name of the Environment identifying a deployed Version to base the created Version on.
     */
    environment?: string;
    /** Commit message for the new Dataset version. */
    commitMessage: string;
}
