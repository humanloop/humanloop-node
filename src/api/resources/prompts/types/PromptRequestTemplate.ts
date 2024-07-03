/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../../../index";

/**
 * For chat endpoint, provide a Chat template. For completion endpoint, provide a Prompt template. Input variables within the template should be specified with double curly bracket syntax: {{INPUT_NAME}}.
 */
export type PromptRequestTemplate = string | Humanloop.ChatMessage[];
