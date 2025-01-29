/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../../../../index";

/**
 * @example
 *     {
 *         path: "Personal Projects/Coding Assistant",
 *         model: "gpt-4o",
 *         endpoint: "chat",
 *         template: [{
 *                 content: "You are a helpful coding assistant specialising in {{language}}",
 *                 role: "system"
 *             }],
 *         provider: "openai",
 *         maxTokens: -1,
 *         temperature: 0.7,
 *         commitMessage: "Initial commit"
 *     }
 */
export interface PromptRequest {
    /** Path of the Prompt, including the name. This locates the Prompt in the Humanloop filesystem and is used as as a unique identifier. For example: `folder/name` or just `name`. */
    path?: string;
    /** ID for an existing Prompt. */
    id?: string;
    /** The model instance used, e.g. `gpt-4`. See [supported models](https://humanloop.com/docs/reference/supported-models) */
    model: string;
    /** The provider model endpoint used. */
    endpoint?: Humanloop.ModelEndpoints;
    /**
     * The template contains the main structure and instructions for the model, including input variables for dynamic values.
     *
     * For chat models, provide the template as a ChatTemplate (a list of messages), e.g. a system message, followed by a user message with an input variable.
     * For completion models, provide a prompt template as a string.
     *
     * Input variables should be specified with double curly bracket syntax: `{{input_name}}`.
     */
    template?: Humanloop.PromptRequestTemplate;
    /** The company providing the underlying model service. */
    provider?: Humanloop.ModelProviders;
    /** The maximum number of tokens to generate. Provide max_tokens=-1 to dynamically calculate the maximum number of tokens to generate given the length of the prompt */
    maxTokens?: number;
    /** What sampling temperature to use when making a generation. Higher values means the model will be more creative. */
    temperature?: number;
    /** An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. */
    topP?: number;
    /** The string (or list of strings) after which the model will stop generating. The returned text will not contain the stop sequence. */
    stop?: Humanloop.PromptRequestStop;
    /** Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the generation so far. */
    presencePenalty?: number;
    /** Number between -2.0 and 2.0. Positive values penalize new tokens based on how frequently they appear in the generation so far. */
    frequencyPenalty?: number;
    /** Other parameter values to be passed to the provider call. */
    other?: Record<string, unknown>;
    /** If specified, model will make a best effort to sample deterministically, but it is not guaranteed. */
    seed?: number;
    /** The format of the response. Only `{"type": "json_object"}` is currently supported for chat. */
    responseFormat?: Humanloop.ResponseFormat;
    /** The tool specification that the model can choose to call if Tool calling is supported. */
    tools?: Humanloop.ToolFunction[];
    /** The IDs of the Tools in your organization that the model can choose to call if Tool calling is supported. The default deployed version of that tool is called. */
    linkedTools?: string[];
    /** Additional fields to describe the Prompt. Helpful to separate Prompt versions from each other with details on how they were created or used. */
    attributes?: Record<string, unknown>;
    /** Message describing the changes made. */
    commitMessage?: string;
}
