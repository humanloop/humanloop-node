/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

/**
 * A tool call to be made.
 */
export interface ToolCall {
    id: string;
    type: Humanloop.ChatToolType;
    function: Humanloop.FunctionTool;
}
