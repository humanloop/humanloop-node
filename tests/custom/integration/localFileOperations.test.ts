import * as fs from "fs";
import * as path from "path";

import { ChatMessage } from "../../../src/api";
import { HumanloopRuntimeError } from "../../../src/error";
import { HumanloopClient } from "../../../src/humanloop.client";
import { createTempDir } from "../fixtures";
import {
    TestSetup,
    cleanupTestEnvironment,
    createSyncableFilesFixture,
    setupTestEnvironment,
} from "./fixtures";

// Set global timeout for all tests in this suite
jest.setTimeout(40 * 1000); // 40 seconds

// Define SyncableFile interface to match Python version
interface SyncableFile {
    path: string;
    type: "prompt" | "agent";
    model: string;
    id?: string;
    versionId?: string;
}

interface PathTestCase {
    name: string;
    pathGenerator: (file: SyncableFile) => string;
    shouldPass: boolean;
    expectedError?: string; // Only required when shouldPass is false
}

describe("Local File Operations Integration Tests", () => {
    let testSetup: TestSetup;
    let syncableFiles: SyncableFile[] = [];
    let tempDirInfo: { tempDir: string; cleanup: () => void };

    beforeAll(async () => {
        // Set up test environment
        testSetup = await setupTestEnvironment("local_file_ops");
        tempDirInfo = createTempDir("local-file-integration");

        // Create test files in Humanloop for syncing
        syncableFiles = await createSyncableFilesFixture(testSetup);

        // Pull files for tests that need them pre-pulled
        const setupClient = new HumanloopClient({
            apiKey: process.env.HUMANLOOP_API_KEY,
            localFilesDirectory: tempDirInfo.tempDir,
            useLocalFiles: true,
        });

        await setupClient.pull();
    });

    afterAll(async () => {
        // Clean up resources
        tempDirInfo.cleanup();
        await cleanupTestEnvironment(
            testSetup,
            syncableFiles.map((file) => ({
                type: file.type as any,
                id: file.id as string,
            })),
        );
    });

    describe("Path Validation", () => {
        // Path validation test cases
        const pathTestCases = [
            // Basic path test cases
            {
                name: "With whitespace",
                pathGenerator: (file: SyncableFile) => ` ${file.path} `,
                shouldPass: true,
            },
            {
                name: "Standard extension",
                pathGenerator: (file: SyncableFile) => `${file.path}.${file.type}`,
                expectedError: "should not include any file extension",
            },
            {
                name: "Uppercase extension",
                pathGenerator: (file: SyncableFile) =>
                    `${file.path}.${file.type.toUpperCase()}`,
                expectedError: "should not include any file extension",
            },
            {
                name: "Mixed case extension",
                pathGenerator: (file: SyncableFile) =>
                    `${file.path}.${file.type.charAt(0).toUpperCase() + file.type.slice(1)}`,
                expectedError: "should not include any file extension",
            },
            // Slash path test cases
            {
                name: "Trailing slash",
                pathGenerator: (file: SyncableFile) => `${file.path}/`,
                expectedError: "Path .* format is invalid",
            },
            {
                name: "Leading slash",
                pathGenerator: (file: SyncableFile) => `/${file.path}`,
                expectedError: "Path .* format is invalid",
            },
            {
                name: "Both leading and trailing slashes",
                pathGenerator: (file: SyncableFile) => `/${file.path}/`,
                expectedError: "Path .* format is invalid",
            },
            {
                name: "Multiple leading and trailing slashes",
                pathGenerator: (file: SyncableFile) => `//${file.path}//`,
                expectedError: "Path .* format is invalid",
            },
            // Combined path test cases
            {
                name: "Extension and trailing slash",
                pathGenerator: (file: SyncableFile) => `${file.path}.${file.type}/`,
                expectedError: "Path .* format is invalid",
            },
            {
                name: "Extension and leading slash",
                pathGenerator: (file: SyncableFile) => `/${file.path}.${file.type}`,
                expectedError: "Path .* format is invalid",
            },
        ];

        // Test all path validation cases
        test.each(pathTestCases)(
            "should $shouldPass ? 'accept' : 'reject' $name path format",
            async ({ pathGenerator, expectedError, shouldPass }) => {
                // GIVEN a client with local files enabled and a test file
                const client = new HumanloopClient({
                    apiKey: process.env.HUMANLOOP_API_KEY,
                    localFilesDirectory: tempDirInfo.tempDir,
                    useLocalFiles: true,
                });

                const testFile = syncableFiles[0];
                const testPath = pathGenerator(testFile);
                const testMessage: ChatMessage[] = [
                    { role: "user", content: "Testing" },
                ];

                // WHEN using the path
                if (shouldPass) {
                    // THEN it should work (just trimming whitespace)
                    if (testFile.type === "prompt") {
                        await expect(
                            client.prompts.call({
                                path: testPath,
                                messages: testMessage,
                            }),
                        ).resolves.toBeDefined();
                    } else if (testFile.type === "agent") {
                        await expect(
                            client.agents.call({
                                path: testPath,
                                messages: testMessage,
                            }),
                        ).resolves.toBeDefined();
                    }
                } else {
                    // Type guard to ensure expectedError is defined when shouldPass is false
                    if (!expectedError) {
                        throw new Error(
                            "expectedError must be defined when shouldPass is false",
                        );
                    }

                    // THEN appropriate error should be raised
                    if (testFile.type === "prompt") {
                        await expect(
                            client.prompts.call({
                                path: testPath,
                                messages: testMessage,
                            }),
                        ).rejects.toThrow(new RegExp(expectedError));
                    } else if (testFile.type === "agent") {
                        await expect(
                            client.agents.call({
                                path: testPath,
                                messages: testMessage,
                            }),
                        ).rejects.toThrow(new RegExp(expectedError));
                    }
                }
            },
        );
    });

    test("local_file_call: should call API with local prompt file", async () => {
        // GIVEN a local prompt file with proper system tag
        const promptContent = `---
model: gpt-4o-mini
temperature: 1.0
max_tokens: -1
top_p: 1.0
presence_penalty: 0.0
frequency_penalty: 0.0
provider: openai
endpoint: chat
tools: []
---

<system>
You are a helpful assistant that provides concise answers. When asked about capitals of countries, 
you respond with just the capital name, lowercase, with no punctuation or additional text.
</system>
`;

        // Create local file structure in temporary directory
        const testPath = `${testSetup.sdkTestDir.path}/capital_prompt`;
        const filePath = path.join(tempDirInfo.tempDir, `${testPath}.prompt`);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, promptContent);

        // GIVEN a client with local files enabled
        const client = new HumanloopClient({
            apiKey: process.env.HUMANLOOP_API_KEY,
            localFilesDirectory: tempDirInfo.tempDir,
            useLocalFiles: true,
        });

        // WHEN calling the API with the local file path (without extension)
        const callMessages: ChatMessage[] = [
            { role: "user", content: "What is the capital of France?" },
        ];
        const response = await client.prompts.call({
            path: testPath,
            messages: callMessages,
        });

        // THEN the response should be successful
        expect(response).toBeDefined();
        expect(response.logs).toBeDefined();
        expect(response.logs?.length).toBeGreaterThan(0);

        // AND the response should contain the expected output format (lowercase city name)
        const output = response.logs?.[0].output;
        expect(output).toBeDefined();
        expect(output?.toLowerCase()).toContain("paris");

        // AND the prompt used should match our expected path
        expect(response.prompt).toBeDefined();
        expect(response.prompt?.path).toBe(testPath);
    });

    test("local_file_log: should log data with local prompt file", async () => {
        // GIVEN a local prompt file with proper system tag
        const promptContent = `---
model: gpt-4o-mini
temperature: 1.0
max_tokens: -1
top_p: 1.0
presence_penalty: 0.0
frequency_penalty: 0.0
provider: openai
endpoint: chat
tools: []
---

<system>
You are a helpful assistant that answers questions about geography.
</system>
`;

        // Create local file structure in temporary directory
        const testPath = `${testSetup.sdkTestDir.path}/geography_prompt`;
        const filePath = path.join(tempDirInfo.tempDir, `${testPath}.prompt`);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, promptContent);

        // GIVEN a client with local files enabled
        const client = new HumanloopClient({
            apiKey: process.env.HUMANLOOP_API_KEY,
            localFilesDirectory: tempDirInfo.tempDir,
            useLocalFiles: true,
        });

        // GIVEN message content to log
        const testOutput = "Paris is the capital of France.";

        // WHEN logging the data with the local file path
        const messages: ChatMessage[] = [
            { role: "user", content: "What is the capital of France?" },
        ];
        const response = await client.prompts.log({
            path: testPath,
            messages: messages,
            output: testOutput,
        });

        // THEN the log should be successful
        expect(response).toBeDefined();
        expect(response.promptId).toBeDefined();
        expect(response.id).toBeDefined(); // log ID

        // WHEN retrieving the logged prompt details
        const promptDetails = await client.prompts.get(response.promptId);

        // THEN the details should match our expected path
        expect(promptDetails).toBeDefined();
        expect(promptDetails.path).toContain(testPath);
    });

    test("overload_version_environment_handling: should handle version_id and environment parameters", async () => {
        // GIVEN a client with local files enabled
        const client = new HumanloopClient({
            apiKey: process.env.HUMANLOOP_API_KEY,
            localFilesDirectory: tempDirInfo.tempDir,
            useLocalFiles: true,
        });

        const testMessage: ChatMessage[] = [{ role: "user", content: "Testing" }];

        // GIVEN a test file that exists locally
        const testFile = syncableFiles[0];
        const extension = `.${testFile.type}`;
        const localPath = path.join(
            tempDirInfo.tempDir,
            `${testFile.path}${extension}`,
        );

        // THEN the file should exist locally
        expect(fs.existsSync(localPath)).toBe(true);
        expect(fs.existsSync(path.dirname(localPath))).toBe(true);

        // WHEN calling with version_id
        // THEN a HumanloopRuntimeError should be raised
        if (testFile.type === "prompt") {
            await expect(
                client.prompts.call({
                    path: testFile.path,
                    versionId: testFile.versionId,
                    messages: testMessage,
                }),
            ).rejects.toThrow(
                /Cannot use local file.*version_id or environment was specified/,
            );
        } else if (testFile.type === "agent") {
            await expect(
                client.agents.call({
                    path: testFile.path,
                    versionId: testFile.versionId,
                    messages: testMessage,
                }),
            ).rejects.toThrow(
                /Cannot use local file.*version_id or environment was specified/,
            );
        }

        // WHEN calling with environment
        // THEN a HumanloopRuntimeError should be raised
        if (testFile.type === "prompt") {
            await expect(
                client.prompts.call({
                    path: testFile.path,
                    environment: "production",
                    messages: testMessage,
                }),
            ).rejects.toThrow(
                /Cannot use local file.*version_id or environment was specified/,
            );
        } else if (testFile.type === "agent") {
            await expect(
                client.agents.call({
                    path: testFile.path,
                    environment: "production",
                    messages: testMessage,
                }),
            ).rejects.toThrow(
                /Cannot use local file.*version_id or environment was specified/,
            );
        }

        // WHEN calling with both version_id and environment
        // THEN a HumanloopRuntimeError should be raised
        if (testFile.type === "prompt") {
            await expect(
                client.prompts.call({
                    path: testFile.path,
                    versionId: testFile.versionId,
                    environment: "staging",
                    messages: testMessage,
                }),
            ).rejects.toThrow(
                /Cannot use local file.*version_id or environment was specified/,
            );
        } else if (testFile.type === "agent") {
            await expect(
                client.agents.call({
                    path: testFile.path,
                    versionId: testFile.versionId,
                    environment: "staging",
                    messages: testMessage,
                }),
            ).rejects.toThrow(
                /Cannot use local file.*version_id or environment was specified/,
            );
        }
    });
});
