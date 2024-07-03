/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

/**
 * Controls how the model uses tools. The following options are supported:
 *
 * - `'none'` means the model will not call any tool and instead generates a message; this is the default when no tools are provided as part of the Prompt.
 * - `'auto'` means the model can decide to call one or more of the provided tools; this is the default when tools are provided as part of the Prompt.
 * - `'required'` means the model can decide to call one or more of the provided tools.
 * - `{'type': 'function', 'function': {name': <TOOL_NAME>}}` forces the model to use the named function.
 */
export type PromptCallResponseToolChoice = "none" | "auto" | "required" | Humanloop.ToolChoice;
