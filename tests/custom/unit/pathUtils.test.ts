import { normalizePath } from "../../../src/pathUtils";

describe("normalizePath", () => {
    const testCases = [
        // Basic cases
        {
            input: "path/to/file.prompt",
            expectedWithExtension: "path/to/file.prompt",
            expectedWithoutExtension: "path/to/file",
        },
        {
            input: "path\\to\\file.agent",
            expectedWithExtension: "path/to/file.agent",
            expectedWithoutExtension: "path/to/file",
        },
        {
            input: "/leading/slashes/file.prompt",
            expectedWithExtension: "leading/slashes/file.prompt",
            expectedWithoutExtension: "leading/slashes/file",
        },
        {
            input: "trailing/slashes/file.agent/",
            expectedWithExtension: "trailing/slashes/file.agent",
            expectedWithoutExtension: "trailing/slashes/file",
        },
        {
            input: "multiple//slashes//file.prompt",
            expectedWithExtension: "multiple/slashes/file.prompt",
            expectedWithoutExtension: "multiple/slashes/file",
        },
        // Edge cases
        {
            input: "path/to/file with spaces.prompt",
            expectedWithExtension: "path/to/file with spaces.prompt",
            expectedWithoutExtension: "path/to/file with spaces",
        },
        {
            input: "path/to/file\\with\\backslashes.prompt",
            expectedWithExtension: "path/to/file/with/backslashes.prompt",
            expectedWithoutExtension: "path/to/file/with/backslashes",
        },
        {
            input: "path/to/unicode/文件.prompt",
            expectedWithExtension: "path/to/unicode/文件.prompt",
            expectedWithoutExtension: "path/to/unicode/文件",
        },
        {
            input: "path/to/special/chars/!@#$%^&*().prompt",
            expectedWithExtension: "path/to/special/chars/!@#$%^&*().prompt",
            expectedWithoutExtension: "path/to/special/chars/!@#$%^&*()",
        },
    ];

    test.each(testCases)(
        "normalizes path '$input' correctly",
        ({ input, expectedWithExtension, expectedWithoutExtension }) => {
            // Test without stripping extension
            const resultWithExtension = normalizePath(input, false);
            expect(resultWithExtension).toBe(expectedWithExtension);

            // Test with extension stripping
            const resultWithoutExtension = normalizePath(input, true);
            expect(resultWithoutExtension).toBe(expectedWithoutExtension);

            // Add custom failure messages if needed
            if (resultWithExtension !== expectedWithExtension) {
                throw new Error(
                    `Failed with stripExtension=false for '${input}'. Expected '${expectedWithExtension}', got '${resultWithExtension}'`,
                );
            }
            if (resultWithoutExtension !== expectedWithoutExtension) {
                throw new Error(
                    `Failed with stripExtension=true for '${input}'. Expected '${expectedWithoutExtension}', got '${resultWithoutExtension}'`,
                );
            }
        },
    );
});
