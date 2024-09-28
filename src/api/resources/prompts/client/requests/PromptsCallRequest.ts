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
 *                     content: "You are stockbot. Return latest prices."
 *                 }],
 *             tools: [{
 *                     name: "get_stock_price",
 *                     description: "Get current stock price",
 *                     parameters: {
 *                         "type": "object",
 *                         "properties": {
 *                             "ticker_symbol": {
 *                                 "type": "string",
 *                                 "name": "Ticker Symbol",
 *                                 "description": "Ticker symbol of the stock"
 *                             }
 *                         },
 *                         "required": []
 *                     }
 *                 }]
 *         },
 *         messages: [{
 *                 role: "user",
 *                 content: "latest apple"
 *             }]
 *     }
 *
 * @example
 *     {
 *         path: "persona",
 *         prompt: {
 *             model: "gpt-4",
 *             template: [{
 *                     role: "system",
 *                     content: "You are {{person}}. Answer any questions as this person. Do not break character."
 *                 }]
 *         },
 *         messages: [{
 *                 role: "user",
 *                 content: "What really happened at Roswell?"
 *             }],
 *         inputs: {
 *             "person": "Trump"
 *         }
 *     }
 *
 * @example
 *     {
 *         versionId: "prv_Wu6zx1lAWJRqOyL8nWuZk",
 *         path: "persona",
 *         messages: [{
 *                 role: "user",
 *                 content: "What really happened at Roswell?"
 *             }],
 *         inputs: {
 *             "person": "Trump"
 *         }
 *     }
 */
export interface PromptsCallRequest {
    /**
     * A specific Version ID of the Prompt to log to.
     */
    versionId?: string;
    /**
     * Name of the Environment identifying a deployed version to log to.
     */
    environment?: string;
    /** Path of the Prompt, including the name. This locates the Prompt in the Humanloop filesystem and is used as as a unique identifier. For example: `folder/name` or just `name`. */
    path?: string;
    /** ID for an existing Prompt. */
    id?: string;
    /** The messages passed to the to provider chat endpoint. */
    messages?: Humanloop.ChatMessage[];
    /**
     * Controls how the model uses tools. The following options are supported:
     * - `'none'` means the model will not call any tool and instead generates a message; this is the default when no tools are provided as part of the Prompt.
     * - `'auto'` means the model can decide to call one or more of the provided tools; this is the default when tools are provided as part of the Prompt.
     * - `'required'` means the model can decide to call one or more of the provided tools.
     * - `{'type': 'function', 'function': {name': <TOOL_NAME>}}` forces the model to use the named function.
     */
    toolChoice?: Humanloop.PromptsCallRequestToolChoice;
    /** Details of your Prompt. A new Prompt version will be created if the provided details are new. */
    prompt?: Humanloop.PromptKernelRequest;
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
    /** Unique identifier for the Datapoint that this Log is derived from. This can be used by Humanloop to associate Logs to Evaluations. If provided, Humanloop will automatically associate this Log to Evaluations that require a Log for this Datapoint-Version pair. */
    sourceDatapointId?: string;
    /** The ID of the parent Log to nest this Log under in a Trace. */
    traceParentId?: string;
    /** Unique identifier for the Batch to add this Batch to. Batches are used to group Logs together for Evaluations. A Batch will be created if one with the given ID does not exist. */
    batchId?: string;
    /** End-user ID related to the Log. */
    user?: string;
    /** The name of the Environment the Log is associated to. */
    promptsCallRequestEnvironment?: string;
    /** Whether the request/response payloads will be stored on Humanloop. */
    save?: boolean;
    /** API keys required by each provider to make API calls. The API keys provided here are not stored by Humanloop. If not specified here, Humanloop will fall back to the key saved to your organization. */
    providerApiKeys?: Humanloop.ProviderApiKeys;
    /** The number of generations. */
    numSamples?: number;
    /** Whether to return the inputs in the response. If false, the response will contain an empty dictionary under inputs. This is useful for reducing the size of the response. Defaults to true. */
    returnInputs?: boolean;
    /** Include the log probabilities of the top n tokens in the provider_response */
    logprobs?: number;
    /** The suffix that comes after a completion of inserted text. Useful for completions that act like inserts. */
    suffix?: string;
}
