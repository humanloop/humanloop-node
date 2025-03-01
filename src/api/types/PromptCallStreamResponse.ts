/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

/**
 * Response model for calling Prompt in streaming mode.
 */
export interface PromptCallStreamResponse {
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
    /** The message returned by the provider. */
    outputMessage?: Humanloop.ChatMessage;
    /** Number of tokens in the prompt used to generate the output. */
    promptTokens?: number;
    /** Number of reasoning tokens used to generate the output. */
    reasoningTokens?: number;
    /** Number of tokens in the output generated by the model. */
    outputTokens?: number;
    /** Cost in dollars associated to the tokens in the prompt. */
    promptCost?: number;
    /** Cost in dollars associated to the tokens in the output. */
    outputCost?: number;
    /** Reason the generation finished. */
    finishReason?: string;
    /** The index of the sample in the batch. */
    index: number;
    /** ID of the log. */
    id: string;
    /** ID of the Prompt the log belongs to. */
    promptId: string;
    /** ID of the specific version of the Prompt. */
    versionId: string;
}
