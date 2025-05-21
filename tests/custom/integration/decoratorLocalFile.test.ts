import * as fs from "fs";
import * as path from "path";

import { HumanloopClient } from "../../../src/humanloop.client";
import { createTempDir } from "../fixtures";
import { TestSetup, cleanupTestEnvironment, setupTestEnvironment } from "./fixtures";

// Set global timeout for all tests in this suite
jest.setTimeout(30 * 1000); // 30 seconds

describe("Decorator and Local File Integration Tests", () => {
    let testSetup: TestSetup;
    let tempDirInfo: { tempDir: string; cleanup: () => void };
    let flowId: string | null = null;

    beforeAll(async () => {
        testSetup = await setupTestEnvironment("decorator_local_file");
        tempDirInfo = createTempDir("decorator-local-file-integration");
    });

    afterAll(async () => {
        tempDirInfo.cleanup();
        if (flowId) {
            await cleanupTestEnvironment(testSetup, [
                {
                    type: "flow",
                    id: flowId,
                },
            ]);
        } else {
            await cleanupTestEnvironment(testSetup);
        }
    });

    test("flow decorator should work with local prompt files", async () => {
        // GIVEN a local prompt file
        const promptContent = `---
model: gpt-4o-mini
temperature: 0
max_tokens: -1
provider: openai
endpoint: chat
tools: []
---

<system>
You are a helpful assistant that provides concise answers. When asked about capitals of countries, 
you respond with just the capital name, lowercase, with no punctuation or additional text.
</system>
`;

        // Create local file structure
        const promptPath = `${testSetup.sdkTestDir.path}/capital_prompt`;
        const promptFilePath = path.join(tempDirInfo.tempDir, `${promptPath}.prompt`);
        fs.mkdirSync(path.dirname(promptFilePath), { recursive: true });
        fs.writeFileSync(promptFilePath, promptContent);

        // GIVEN a client with local files enabled
        const client = new HumanloopClient({
            apiKey: process.env.HUMANLOOP_API_KEY,
            localFilesDirectory: tempDirInfo.tempDir,
            useLocalFiles: true,
        });

        // GIVEN a flow that uses the local prompt
        const flowPath = `${testSetup.sdkTestDir.path}/test_flow_with_local_prompt`;
        const myFlow = client.flow({
            path: flowPath,
            callable: async (question: { question: string }) => {
                // This is the key integration point - using a local prompt within a flow
                const response = await client.prompts.call({
                    path: promptPath,
                    messages: [{ role: "user", content: question.question }],
                    providerApiKeys: { openai: testSetup.openaiApiKey },
                });
                return response.logs?.[0]?.output || "";
            },
        });

        // WHEN calling the flow
        const result = await myFlow({
            question: "What is the capital of France?",
        });

        // THEN it should work with the local prompt
        expect(result?.toLowerCase()).toContain("paris");

        // AND the logs should be properly linked
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Get file IDs for log verification
        const [flowFile, promptFile] = await Promise.all([
            client.files.retrieveByPath({ path: flowPath }),
            client.files.retrieveByPath({ path: promptPath }),
        ]);
        flowId = flowFile.id;

        // Verify the logs are linked
        const [flowLogs, promptLogs] = await Promise.all([
            client.logs.list({ fileId: flowFile.id, page: 1, size: 1 }),
            client.logs.list({ fileId: promptFile.id, page: 1, size: 1 }),
        ]);

        // The key assertion - verify tracing works with local files
        expect(promptLogs.data[0].traceParentId).toBe(flowLogs.data[0].id);
    });
});
