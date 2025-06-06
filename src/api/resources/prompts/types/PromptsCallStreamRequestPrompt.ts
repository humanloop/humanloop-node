/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../../../index";

/**
 * The Prompt configuration to use. Two formats are supported:
 * - An object representing the details of the Prompt configuration
 * - A string representing the raw contents of a .prompt file
 * A new Prompt version will be created if the provided details do not match any existing version.
 */
export type PromptsCallStreamRequestPrompt = Humanloop.PromptKernelRequest | string;
