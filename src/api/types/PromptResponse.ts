/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

/**
 * Request model for creating a new Prompt
 */
export interface PromptResponse {
    /** Path of the Prompt, including the name, which is used as a unique identifier. */
    path: string;
    /** Unique identifier for the Prompt. */
    id: string;
    /** Name of the Prompt. */
    name: string;
    /** Unique identifier for the specific Prompt Version. If no query params provided, the default deployed Prompt Version is returned. */
    versionId: string;
    type?: "prompt";
    /** The list of environments the Prompt Version is deployed to. */
    environments?: Humanloop.EnvironmentResponse[];
    createdAt: Date;
    updatedAt: Date;
    /** The user who created the Prompt. */
    createdBy?: Humanloop.UserResponse;
    /** The status of the Prompt Version. */
    status: Humanloop.VersionStatus;
    lastUsedAt: Date;
    /** The model instance used, e.g. `gpt-4`. See [supported models](https://humanloop.com/docs/supported-models) */
    model: string;
    /** The provider model endpoint used. */
    endpoint?: Humanloop.ModelEndpoints;
    /** For chat endpoint, provide a Chat template. For completion endpoint, provide a Prompt template. Input variables within the template should be specified with double curly bracket syntax: {{INPUT_NAME}}. */
    template?: Humanloop.PromptResponseTemplate;
    /** The company providing the underlying model service. */
    provider?: Humanloop.ModelProviders;
    /** The maximum number of tokens to generate. Provide max_tokens=-1 to dynamically calculate the maximum number of tokens to generate given the length of the prompt */
    maxTokens?: number;
    /** What sampling temperature to use when making a generation. Higher values means the model will be more creative. */
    temperature?: number;
    /** An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. */
    topP?: number;
    /** The string (or list of strings) after which the model will stop generating. The returned text will not contain the stop sequence. */
    stop?: Humanloop.PromptResponseStop;
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
    /** The tools linked to your prompt that the model can call. */
    linkedTools?: Humanloop.LinkedToolResponse[];
    /** Message describing the changes made. */
    commitMessage?: string;
    /** The number of logs that have been generated for this Prompt Version */
    versionLogsCount: number;
    /** The number of logs that have been generated across all Prompt Versions */
    totalLogsCount: number;
    /** Inputs associated to the Prompt. Inputs correspond to any of the variables used within the Prompt template. */
    inputs: Humanloop.InputResponse[];
    /** Evaluators that have been attached to this Prompt that are used for monitoring logs. */
    evaluators?: Humanloop.MonitoringEvaluatorResponse[];
    /** Aggregation of Evaluator results for the Prompt Version. */
    evaluatorAggregates?: Humanloop.EvaluatorAggregate[];
}
