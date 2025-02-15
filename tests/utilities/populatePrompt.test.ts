import { ChatMessage } from "../../src/api";
import {
    PromptVariablesNotFoundError,
    populateChatTemplate,
    populatePromptTemplate,
    populateTemplate,
} from "../../src/prompt_utils";

describe("Prompt Utils", () => {
    describe("populatePromptTemplate", () => {
        it("replaces simple variables", () => {
            const template = "Hello {{name}}!";
            const result = populatePromptTemplate(template, { name: "Alice" });
            expect(result).toBe("Hello Alice!");
        });

        it("handles multiple variables", () => {
            const template = "{{greeting}} {{name}}, how are you?";
            const result = populatePromptTemplate(template, {
                greeting: "Hi",
                name: "Bob",
            });
            expect(result).toBe("Hi Bob, how are you?");
        });

        it("handles whitespace in variable syntax", () => {
            const template = "Hello {{ name }}!";
            const result = populatePromptTemplate(template, { name: "Charlie" });
            expect(result).toBe("Hello Charlie!");
        });

        it("handles tool calls", () => {
            const template = 'Using tool: {{ tool_1("arg1", "arg2") }}';
            const result = populatePromptTemplate(template, {
                'tool_1("arg1", "arg2")': "result",
            });
            expect(result).toBe("Using tool: result");
        });

        it("converts non-string values to strings", () => {
            const template = "Number: {{num}}";
            const result = populatePromptTemplate(template, { num: 42 });
            expect(result).toBe("Number: 42");
        });

        it("throws PromptVariablesNotFoundError for missing variables", () => {
            const template = "Hello {{name}}!";
            expect(() => populatePromptTemplate(template, {})).toThrow(
                PromptVariablesNotFoundError,
            );
        });
    });

    describe("populateChatTemplate", () => {
        it("populates string content in chat messages", () => {
            const template: ChatMessage[] = [
                { role: "user", content: "My name is {{name}}" },
            ];
            const result = populateChatTemplate(template, { name: "David" });
            expect(result).toEqual([{ role: "user", content: "My name is David" }]);
        });

        it("populates array content in chat messages", () => {
            const template: ChatMessage[] = [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Hello {{name}}" },
                        { type: "text", text: "Second text" },
                    ],
                },
            ];
            const result = populateChatTemplate(template, { name: "Eve" });
            expect(result).toEqual([
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Hello Eve" },
                        { type: "text", text: "Second text" },
                    ],
                },
            ]);
        });

        it("preserves messages without content", () => {
            const template: ChatMessage[] = [{ role: "system", content: "" }];
            const result = populateChatTemplate(template);
            expect(result).toEqual(template);
        });
    });

    describe("populateTemplate", () => {
        it("handles string templates", () => {
            const template = "Hello {{name}}!";
            const result = populateTemplate(template, { name: "Frank" });
            expect(result).toBe("Hello Frank!");
        });

        it("handles chat templates", () => {
            const template: ChatMessage[] = [
                { role: "user", content: "Hello {{name}}!" },
            ];
            const result = populateTemplate(template, { name: "Grace" });
            expect(result).toEqual([{ role: "user", content: "Hello Grace!" }]);
        });
    });
});
