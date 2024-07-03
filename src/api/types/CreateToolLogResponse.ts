/**
 * This file was auto-generated by Fern from our API Definition.
 */

export interface CreateToolLogResponse {
    /** String ID of log. */
    id: string;
    /** ID of the Tool the log belongs to. */
    toolId: string;
    /** ID of the specific version of the Tool. */
    versionId: string;
    /** String ID of session the log belongs to. */
    sessionId?: string;
}
