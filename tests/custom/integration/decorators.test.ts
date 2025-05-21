import OpenAI from "openai";

import { PromptRequest } from "../../../src/api";
import { HumanloopRuntimeError } from "../../../src/error";
import {
    CleanupResources,
    TestPrompt,
    TestSetup,
    cleanupTestEnvironment,
    setupTestEnvironment,
} from "./fixtures";

// Long timeout per test
jest.setTimeout(30 * 1000);

// process.stdout.moveCursor is undefined in jest; mocking it since STDOUT is not relevant
if (typeof process.stdout.moveCursor !== "function") {
    process.stdout.moveCursor = (
        dx: number,
        dy: number,
        callback?: () => void,
    ): boolean => {
        if (callback) callback();
        return true;
    };
}

/**
 * Creates a test prompt in the specified test environment
 */
async function createTestPrompt(
    setup: TestSetup,
    name: string = "test_prompt",
    customConfig?: Partial<PromptRequest>,
): Promise<TestPrompt> {
    const promptPath = `${setup.sdkTestDir.path}/${name}`;
    const config = customConfig
        ? { ...setup.testPromptConfig, ...customConfig }
        : setup.testPromptConfig;

    const promptResponse = await setup.humanloopClient.prompts.upsert({
        path: promptPath,
        ...config,
    });

    return {
        id: promptResponse.id,
        path: promptPath,
        response: promptResponse,
    };
}

/**
 * Creates a base function for LLM calls that can be decorated
 */
function createBaseLLMFunction(setup: TestSetup, model: string = "gpt-4o-mini") {
    return async (question: string): Promise<string> => {
        const openaiClient = new OpenAI({ apiKey: setup.openaiApiKey });

        const response = await openaiClient.chat.completions.create({
            model: model,
            messages: [{ role: "user", content: question }],
        });

        return response.choices[0].message.content || "";
    };
}

/**
 * Applies the prompt decorator to a function and tests it
 */
async function testPromptDecorator(
    setup: TestSetup,
    prompt: TestPrompt,
    input: string = "What is the capital of the France?",
    expectedSubstring: string = "paris",
): Promise<void> {
    // Create the base function
    const myPromptBase = createBaseLLMFunction(setup);

    // Apply the higher-order function instead of decorator
    const myPrompt = setup.humanloopClient.prompt({
        path: prompt.path,
        callable: myPromptBase,
    });

    // Call the decorated function
    const result = await myPrompt(input);
    if (result) {
        expect(result.toLowerCase()).toContain(expectedSubstring.toLowerCase());
    } else {
        throw new Error("Expected result to be defined");
    }

    // Wait for 5 seconds for the log to be created
    await new Promise((resolve) => setTimeout(resolve, 5000));
}

describe("decorators", () => {
    it("should create a prompt log when using the decorator", async () => {
        let testSetup: TestSetup | undefined = undefined;
        let testPrompt: TestPrompt | undefined = undefined;

        try {
            testSetup = await setupTestEnvironment("test_prompt_call_decorator");
            // Create test prompt
            testPrompt = await createTestPrompt(testSetup);

            // Check initial version count
            const promptVersionsResponse =
                await testSetup.humanloopClient.prompts.listVersions(testPrompt.id);
            expect(promptVersionsResponse.records.length).toBe(1);

            // Test the prompt decorator
            await testPromptDecorator(testSetup, testPrompt);

            // Verify a new version was created
            const updatedPromptVersionsResponse =
                await testSetup.humanloopClient.prompts.listVersions(testPrompt.id);
            expect(updatedPromptVersionsResponse.records.length).toBe(2);

            // Verify logs were created
            const logsResponse = await testSetup.humanloopClient.logs.list({
                fileId: testPrompt.id,
                page: 1,
                size: 50,
            });
            expect(logsResponse.data.length).toBe(1);
        } catch (error) {
            // Make sure to clean up if the test fails
            const cleanupResources: CleanupResources[] = [];
            if (testPrompt) {
                cleanupResources.push({
                    type: "prompt",
                    id: testPrompt.id,
                });
            }
            if (testSetup) {
                await cleanupTestEnvironment(testSetup, cleanupResources);
            }
            throw error;
        }
    });

    it("should create logs with proper tracing when using prompt in flow decorator", async () => {
        let testSetup: TestSetup | undefined = undefined;
        let flowId: string | null = null;
        let promptId: string | null = null;

        try {
            // Create test flow and prompt paths
            testSetup = await setupTestEnvironment("test_flow_decorator");
            const flowPath = `${testSetup.sdkTestDir.path}/test_flow`;
            const promptPath = `${testSetup.sdkTestDir.path}/test_prompt`;

            // Create the prompt
            const promptResponse = await testSetup.humanloopClient.prompts.upsert({
                path: promptPath,
                provider: "openai",
                model: "gpt-4o-mini",
                temperature: 0,
            });
            const promptId = promptResponse.id;

            // Define the flow callable function with the correct type signature
            const flowCallable = async (question: {
                question: string;
            }): Promise<string> => {
                const response = await testSetup!.humanloopClient.prompts.call({
                    path: promptPath,
                    messages: [{ role: "user", content: question.question }],
                    providerApiKeys: { openai: testSetup!.openaiApiKey },
                });

                const output = response.logs?.[0]?.output;
                expect(output).not.toBeNull();
                return output || "";
            };

            // Apply the flow decorator
            const myFlow = testSetup.humanloopClient.flow({
                path: flowPath,
                callable: flowCallable,
            });

            // Call the flow with the expected input format
            const result = await myFlow({
                question: "What is the capital of the France?",
            });
            expect(result?.toLowerCase()).toContain("paris");

            // Wait for logs to be created
            await new Promise((resolve) => setTimeout(resolve, 5000));

            // Verify prompt logs
            const promptRetrieveResponse =
                await testSetup.humanloopClient.files.retrieveByPath({
                    path: promptPath,
                });
            expect(promptRetrieveResponse).not.toBeNull();
            const promptLogsResponse = await testSetup.humanloopClient.logs.list({
                fileId: promptRetrieveResponse.id,
                page: 1,
                size: 50,
            });
            expect(promptLogsResponse.data.length).toBe(1);
            const promptLog = promptLogsResponse.data[0];

            // Verify flow logs
            const flowRetrieveResponse =
                await testSetup.humanloopClient.files.retrieveByPath({
                    path: flowPath,
                });
            expect(flowRetrieveResponse).not.toBeNull();
            flowId = flowRetrieveResponse.id;
            const flowLogsResponse = await testSetup.humanloopClient.logs.list({
                fileId: flowRetrieveResponse.id,
                page: 1,
                size: 50,
            });
            expect(flowLogsResponse.data.length).toBe(1);
            const flowLog = flowLogsResponse.data[0];

            // Verify tracing between logs
            expect(promptLog.traceParentId).toBe(flowLog.id);
        } finally {
            // Clean up resources
            const cleanupResources: CleanupResources[] = [];
            if (flowId) {
                cleanupResources.push({
                    type: "flow",
                    id: flowId,
                });
            }
            if (promptId) {
                cleanupResources.push({
                    type: "prompt",
                    id: promptId,
                });
            }
            if (testSetup) {
                await cleanupTestEnvironment(testSetup, cleanupResources);
            }
        }
    });

    it("should log exceptions when using the flow decorator", async () => {
        let testSetup: TestSetup | undefined = undefined;
        let flowId: string | null = null;

        try {
            // Create test flow path
            testSetup = await setupTestEnvironment("test_flow_decorator");
            const flowPath = `${testSetup.sdkTestDir.path}/test_flow_log_error`;

            // Define a flow callable that throws an error
            const flowCallable = async ({
                question,
            }: {
                question: string;
            }): Promise<string> => {
                throw new Error("This is a test exception");
            };

            // Apply the flow decorator
            const myFlow = testSetup.humanloopClient.flow({
                path: flowPath,
                callable: flowCallable,
            });

            // Call the flow and expect it to throw
            try {
                await myFlow({ question: "test" });
                // If we get here, the test should fail
                throw new Error("Expected flow to throw an error but it didn't");
            } catch (error) {
                // Expected error
                expect(error).toBeDefined();
            }

            // Wait for logs to be created
            await new Promise((resolve) => setTimeout(resolve, 5000));

            // Verify flow logs
            const flowRetrieveResponse =
                await testSetup.humanloopClient.files.retrieveByPath({
                    path: flowPath,
                });
            expect(flowRetrieveResponse).not.toBeNull();
            flowId = flowRetrieveResponse.id;

            const flowLogsResponse = await testSetup.humanloopClient.logs.list({
                fileId: flowRetrieveResponse.id,
                page: 1,
                size: 50,
            });
            expect(flowLogsResponse.data.length).toBe(1);

            const flowLog = flowLogsResponse.data[0];
            expect(flowLog.error).not.toBeUndefined();
            expect(flowLog.output).toBeUndefined();
        } finally {
            if (testSetup) {
                await cleanupTestEnvironment(
                    testSetup,
                    flowId
                        ? [
                              {
                                  type: "flow",
                                  id: flowId,
                              },
                          ]
                        : [],
                );
            }
        }
    });

    it("should populate outputMessage when flow returns chat message format", async () => {
        let testSetup: TestSetup | undefined = undefined;
        let flowId: string | null = null;

        try {
            // Create test flow path
            testSetup = await setupTestEnvironment("test_flow_decorator");
            const flowPath = `${testSetup.sdkTestDir.path}/test_flow_log_output_message`;

            // Define a flow callable that returns a chat message format
            const flowCallable = async ({ question }: { question: string }) => {
                return {
                    role: "user",
                    content: question,
                };
            };

            // Apply the flow decorator
            const myFlow = testSetup.humanloopClient.flow({
                path: flowPath,
                callable: flowCallable,
            });

            // Call the flow and check the returned message
            const result = await myFlow({
                question: "What is the capital of the France?",
            });
            expect(result?.content.toLowerCase()).toContain("france");

            // Wait for logs to be created
            await new Promise((resolve) => setTimeout(resolve, 5000));

            // Verify flow logs
            const flowRetrieveResponse =
                await testSetup.humanloopClient.files.retrieveByPath({
                    path: flowPath,
                });
            expect(flowRetrieveResponse).not.toBeNull();
            flowId = flowRetrieveResponse.id;

            const flowLogsResponse = await testSetup.humanloopClient.logs.list({
                fileId: flowRetrieveResponse.id,
                page: 1,
                size: 50,
            });
            expect(flowLogsResponse.data.length).toBe(1);

            const flowLog = flowLogsResponse.data[0];
            expect(flowLog.outputMessage).not.toBeUndefined();
            expect(flowLog.output).toBeUndefined();
            expect(flowLog.error).toBeUndefined();
        } finally {
            // Clean up resources
            if (flowId) {
                await testSetup!.humanloopClient.flows.delete(flowId);
            }
            if (testSetup) {
                await cleanupTestEnvironment(
                    testSetup,
                    flowId
                        ? [
                              {
                                  type: "flow",
                                  id: flowId,
                              },
                          ]
                        : [],
                );
            }
        }
    });

    it("should run evaluations on a flow decorator", async () => {
        let testSetup: TestSetup | undefined = undefined;
        let flowId: string | null = null;

        try {
            // Use fixtures from testSetup
            testSetup = await setupTestEnvironment("eval-flow-decorator");
            if (!testSetup.evalDataset || !testSetup.outputNotNullEvaluator) {
                throw new Error("Required fixtures are not initialized");
            }

            // Create test flow path
            const flowPath = `${testSetup.sdkTestDir.path}/test_flow_evaluate`;

            // Define flow decorated function
            const myFlow = testSetup.humanloopClient.flow({
                path: flowPath,
                callable: async (inputs: { question: string }) => {
                    return "paris";
                },
            });

            // Run evaluation on the flow
            await testSetup.humanloopClient.evaluations.run({
                name: "Evaluate Flow Decorator",
                file: {
                    path: flowPath,
                    callable: myFlow,
                    type: "flow",
                },
                dataset: {
                    path: testSetup.evalDataset.path,
                },
                evaluators: [
                    {
                        path: testSetup.outputNotNullEvaluator.path,
                    },
                ],
            });

            // Get the flow ID for cleanup
            const flowResponse = await testSetup.humanloopClient.files.retrieveByPath({
                path: flowPath,
            });
            flowId = flowResponse.id;
        } finally {
            if (testSetup) {
                await cleanupTestEnvironment(
                    testSetup,
                    flowId
                        ? [
                              {
                                  type: "flow",
                                  id: flowId,
                              },
                          ]
                        : [],
                );
            }
        }
    });

    it("should throw error when using non-existent file ID instead of path", async () => {
        // Use fixtures from testSetup
        let testSetup: TestSetup | undefined = undefined;
        try {
            testSetup = await setupTestEnvironment("eval-flow-decorator");
            if (!testSetup.evalDataset || !testSetup.outputNotNullEvaluator) {
                throw new Error("Required fixtures are not initialized");
            }
            // Define a simple callable
            const simpleCallable = (x: any) => x;

            // Expect the evaluation to throw an error with a non-existent file ID
            try {
                await testSetup.humanloopClient.evaluations.run({
                    name: "Evaluate Flow Decorator",
                    file: {
                        id: "non-existent-file-id",
                        type: "flow",
                        version: {
                            attributes: {
                                foo: "bar",
                            },
                        },
                        callable: simpleCallable,
                    },
                    dataset: {
                        path: testSetup.evalDataset.path,
                    },
                    evaluators: [
                        {
                            path: testSetup.outputNotNullEvaluator.path,
                        },
                    ],
                });

                // If we get here, the test should fail
                throw new Error("Expected HumanloopRuntimeError but none was thrown");
            } catch (error) {
                expect(error).toBeInstanceOf(HumanloopRuntimeError);
                expect((error as HumanloopRuntimeError).message).toContain(
                    "File does not exist on Humanloop. Please provide a `file.path` and a version to create a new version.",
                );
            }
        } finally {
            if (testSetup) {
                await cleanupTestEnvironment(testSetup);
            }
        }
    });
});
