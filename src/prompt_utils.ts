import { ChatMessage, PromptRequestTemplate } from "api";

export class PromptVariablesNotFoundError extends Error {
    public missingVariables: string[];

    constructor(missingVariables: string[]) {
        super(
            `Prompt requires inputs for the following variables: ${missingVariables.join(
                ", ",
            )}`,
        );
        this.missingVariables = missingVariables;

        // Set the prototype explicitly (needed when extending built-ins in TypeScript).
        Object.setPrototypeOf(this, PromptVariablesNotFoundError.prototype);
    }
}

/**
 * Escape special characters in a string for use in a regular expression pattern.
 */
function escapeRegExp(str: string): string {
    // Replaces characters that have special meaning in RegExp with escaped versions.
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Replace backslashes with escaped backslashes.
 */
function sanitizePrompt(prompt: string): string {
    return prompt.replace(/\\/g, "\\\\");
}

/**
 * Find and replace {{variable}} occurrences in a template string with the supplied inputs.
 * Throws PromptVariablesNotFoundError if any template variables are missing.
 */
export function populatePromptTemplate(
    template: string,
    inputs?: Record<string, any>,
): string {
    // Regex to match variables like {{ variable_2 }}
    const variableRegex1 = /{{\s?([a-zA-Z_\d.\[\]]+)\s?}}/g;
    // Regex to match calls like {{ tool_2("args") }}
    const variableRegex2 = /\{\{\s?([a-zA-Z_\-\d]+\([a-zA-Z_\-\d,\s"]+\))\s?\}\}/g;

    // Collect all template variables
    const templateVariables: string[] = [];

    let match: RegExpExecArray | null;
    while ((match = variableRegex1.exec(template)) !== null) {
        templateVariables.push(match[1]);
    }
    while ((match = variableRegex2.exec(template)) !== null) {
        templateVariables.push(match[1]);
    }

    // Populate the template variables; track missing variables
    let prompt = template;
    const missingVars: string[] = [];

    if (!inputs) {
        inputs = {};
    }

    for (const variable of templateVariables) {
        let text: string | undefined = inputs[variable];

        // If not provided, record as missing
        if (text === undefined || text === null) {
            missingVars.push(variable);
        } else {
            // Convert any non-string value to string
            if (typeof text !== "string") {
                console.info(
                    `Converting input value for variable '${variable}' to string: ${text}`,
                );
                text = String(text);
            }
            const replacement = sanitizePrompt(text);
            const variablePattern = new RegExp(
                `{{\\s?${escapeRegExp(variable)}\\s?}}`,
                "g",
            );
            prompt = prompt.replace(variablePattern, replacement);
        }
    }

    if (missingVars.length > 0) {
        missingVars.sort();
        throw new PromptVariablesNotFoundError(missingVars);
    }

    return prompt;
}

/**
 * Accepts a sequence of ChatMessage and interpolates template variables in each message's content.
 */
export function populateChatTemplate(
    chatTemplate: ChatMessage[],
    inputs?: Record<string, string>,
): ChatMessage[] {
    const messages: ChatMessage[] = [];

    for (const message of chatTemplate) {
        // If there's no "content", push as-is.
        if (!("content" in message)) {
            messages.push(message);
            continue;
        }

        // Deep copy the content so we don't mutate the original object.
        let messageContent = JSON.parse(JSON.stringify(message.content));

        if (typeof messageContent === "string") {
            messageContent = populatePromptTemplate(messageContent, inputs);
        } else if (Array.isArray(messageContent)) {
            // If content is an array, try to populate any "text" fields
            for (let i = 0; i < messageContent.length; i++) {
                const contentItem = messageContent[i];
                if (
                    contentItem.type === "text" &&
                    typeof contentItem.text === "string"
                ) {
                    contentItem.text = populatePromptTemplate(contentItem.text, inputs);
                }
            }
        }

        messages.push({
            role: message.role,
            content: messageContent,
        });
    }
    return messages;
}

/**
 * Populates a string-based prompt or chat-based prompt with the given inputs.
 * For string prompts, all occurrences of {{var}} are replaced using populatePromptTemplate.
 * For chat prompts (array of ChatMessage), each message is handled by populateChatTemplate.
 */
export function populateTemplate<T extends PromptRequestTemplate>(
    template: T,
    inputs: Record<string, string>,
): T {
    if (typeof template === "string") {
        // String-based prompt
        return populatePromptTemplate(template, inputs) as T;
    } else if (Array.isArray(template)) {
        // Chat-based prompt
        return populateChatTemplate(template, inputs) as T;
    }
    return template;
}
