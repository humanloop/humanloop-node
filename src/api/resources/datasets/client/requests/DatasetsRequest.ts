/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../../../../index";

/**
 * @example
 *     {
 *         path: "test-questions",
 *         datapoints: [{
 *                 inputs: {
 *                     "question": "What is the capital of France?"
 *                 },
 *                 target: {
 *                     "answer": "Paris"
 *                 }
 *             }, {
 *                 inputs: {
 *                     "question": "Who wrote Hamlet?"
 *                 },
 *                 target: {
 *                     "answer": "William Shakespeare"
 *                 }
 *             }],
 *         action: Humanloop.UpdateDatesetAction.Add,
 *         commitMessage: "Add two new questions and answers"
 *     }
 *
 * @example
 *     {
 *         path: "datasets/support-queries",
 *         datapoints: [{
 *                 messages: [{
 *                         role: Humanloop.ChatRole.User,
 *                         content: "Hi Humanloop support team, I'm having trouble understanding how to use the evaluations feature in your software. Can you provide a step-by-step guide or any resources to help me get started?"
 *                     }],
 *                 target: {
 *                     "feature": "evaluations",
 *                     "issue": "needs step-by-step guide"
 *                 }
 *             }, {
 *                 messages: [{
 *                         role: Humanloop.ChatRole.User,
 *                         content: "Hi there, I'm interested in fine-tuning a language model using your software. Can you explain the process and provide any best practices or guidelines?"
 *                     }],
 *                 target: {
 *                     "feature": "fine-tuning",
 *                     "issue": "process explanation and best practices"
 *                 }
 *             }],
 *         action: Humanloop.UpdateDatesetAction.Add,
 *         commitMessage: "Add two new questions and answers"
 *     }
 */
export interface DatasetsRequest {
    /**
     * ID of the specific Dataset version to base the created Version on. Only used when `action` is `"add"` or `"remove"`.
     */
    versionId?: string;
    /**
     * Name of the Environment identifying a deployed Version to base the created Version on. Only used when `action` is `"add"` or `"remove"`.
     */
    environment?: string;
    /** Path of the Dataset, including the name. This locates the Dataset in the Humanloop filesystem and is used as as a unique identifier. Example: `folder/name` or just `name`. */
    path?: string;
    /** ID for an existing Dataset. */
    id?: string;
    /** The Datapoints to create this Dataset version with. Modify the `action` field to determine how these Datapoints are used. */
    datapoints: Humanloop.CreateDatapointRequest[];
    /**
     * The action to take with the provided Datapoints.
     *
     *  - If `"set"`, the created version will only contain the Datapoints provided in this request.
     *  - If `"add"`, the created version will contain the Datapoints provided in this request in addition to the Datapoints in the target version.
     *  - If `"remove"`, the created version will contain the Datapoints in the target version except for the Datapoints provided in this request.
     *
     * If `"add"` or `"remove"`, one of the `version_id` or `environment` query parameters may be provided.
     */
    action?: Humanloop.UpdateDatesetAction;
    /** Message describing the changes made. If provided, a committed version of the Dataset is created. Otherwise, an uncommitted version is created. */
    commitMessage?: string;
}
