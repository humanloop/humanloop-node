/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../../../../index";

/**
 * @example
 *     {
 *         path: "persona",
 *         prompt: {
 *             model: "gpt-4",
 *             template: [{
 *                     role: "system",
 *                     content: "You are {{person}}. Answer questions as this person. Do not break character."
 *                 }]
 *         },
 *         messages: [{
 *                 role: "user",
 *                 content: "What really happened at Roswell?"
 *             }],
 *         inputs: {
 *             "person": "Trump"
 *         },
 *         createdAt: "2024-07-19T00:29:35.178992",
 *         providerLatency: 6.5931549072265625,
 *         outputMessage: {
 *             content: "Well, you know, there is so much secrecy involved in government, folks, it's unbelievable. They don't want to tell you everything. They don't tell me everything! But about Roswell, it\u2019s a very popular question. I know, I just know, that something very, very peculiar happened there. Was it a weather balloon? Maybe. Was it something extraterrestrial? Could be. I'd love to go down and open up all the classified documents, believe me, I would. But they don't let that happen. The Deep State, folks, the Deep State. They\u2019re unbelievable. They want to keep everything a secret. But whatever the truth is, I can tell you this: it\u2019s something big, very very big. Tremendous, in fact.",
 *             role: "assistant"
 *         },
 *         promptTokens: 100,
 *         outputTokens: 220,
 *         promptCost: 0.00001,
 *         outputCost: 0.0002,
 *         finishReason: "stop"
 *     }
 */
export interface PromptLogRequest {
    /**
     * A specific Version ID of the Prompt to log to.
     */
    versionId?: string;
    /**
     * Name of the Environment identifying a deployed version to log to.
     */
    environment?: string;
    /** Unique identifier for the Evaluation Report to associate the Log to. */
    evaluationId?: string;
    /** Path of the Prompt, including the name. This locates the Prompt in the Humanloop filesystem and is used as as a unique identifier. Example: `folder/name` or just `name`. */
    path?: string;
    /** ID for an existing Prompt. */
    id?: string;
    /** The message returned by the provider. */
    outputMessage?: Humanloop.ChatMessage;
    /** Number of tokens in the prompt used to generate the output. */
    promptTokens?: number;
    /** Number of tokens in the output generated by the model. */
    outputTokens?: number;
    /** Cost in dollars associated to the tokens in the prompt. */
    promptCost?: number;
    /** Cost in dollars associated to the tokens in the output. */
    outputCost?: number;
    /** Reason the generation finished. */
    finishReason?: string;
    /** The messages passed to the to provider chat endpoint. */
    messages?: Humanloop.ChatMessage[];
    /**
     * Controls how the model uses tools. The following options are supported:
     * - `'none'` means the model will not call any tool and instead generates a message; this is the default when no tools are provided as part of the Prompt.
     * - `'auto'` means the model can decide to call one or more of the provided tools; this is the default when tools are provided as part of the Prompt.
     * - `'required'` means the model can decide to call one or more of the provided tools.
     * - `{'type': 'function', 'function': {name': <TOOL_NAME>}}` forces the model to use the named function.
     */
    toolChoice?: Humanloop.PromptLogRequestToolChoice;
    /** Details of your Prompt. A new Prompt version will be created if the provided details are new. */
    prompt?: Humanloop.PromptKernelRequest;
    /** When the logged event started. */
    startTime?: Date;
    /** When the logged event ended. */
    endTime?: Date;
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
    /** Unique identifier for the Datapoint that this Log is derived from. This can be used by Humanloop to associate Logs to Evaluations. If provided, Humanloop will automatically associate this Log to Evaluations that require a Log for this Datapoint-Version pair. */
    sourceDatapointId?: string;
    /** The ID of the parent Log to nest this Log under in a Trace. */
    traceParentId?: string;
    /** Array of Batch Ids that this log is part of. Batches are used to group Logs together for offline Evaluations */
    batches?: string[];
    /** End-user ID related to the Log. */
    user?: string;
    /** The name of the Environment the Log is associated to. */
    promptLogRequestEnvironment?: string;
    /** Whether the request/response payloads will be stored on Humanloop. */
    save?: boolean;
}
