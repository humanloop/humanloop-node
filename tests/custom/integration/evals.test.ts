import { FlowResponse } from "../../../src/api";
import { HumanloopRuntimeError } from "../../../src/error";
import { HumanloopClient } from "../../../src/humanloop.client";
import {
    cleanupTestEnvironment,
    readEnvironment,
    setupTestEnvironment,
} from "./fixtures";

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

// Long timeout per test; evals might take a while to run
jest.setTimeout(30 * 1000);

interface TestIdentifiers {
    id: string;
    path: string;
}

interface TestSetup {
    sdkTestDir: TestIdentifiers;
    outputNotNullEvaluator: TestIdentifiers;
    evalDataset: TestIdentifiers;
    evalPrompt: TestIdentifiers;
    stagingEnvironmentId: string;
}

describe("Evals", () => {
    let humanloopClient: HumanloopClient;
    let openaiApiKey: string;

    beforeAll(async () => {
        readEnvironment();
        if (!process.env.HUMANLOOP_API_KEY) {
            throw new Error("HUMANLOOP_API_KEY is not set");
        }
        if (!process.env.OPENAI_API_KEY) {
            throw new Error("OPENAI_API_KEY is not set for integration tests");
        }
        openaiApiKey = process.env.OPENAI_API_KEY;
        humanloopClient = new HumanloopClient({
            apiKey: process.env.HUMANLOOP_API_KEY,
        });
    });

    it("should be able to import HumanloopClient", async () => {
        const client = new HumanloopClient({ apiKey: process.env.HUMANLOOP_API_KEY });
        expect(client).toBeDefined();
    });

    it("should run evaluation on online files", async () => {
        // Setup test-specific environment
        const setup = await setupTestEnvironment("online_files");

        try {
            await humanloopClient.evaluations.run({
                file: {
                    path: setup.evalPrompt.path,
                    type: "prompt",
                },
                dataset: {
                    path: setup.evalDataset.path,
                },
                name: "test_eval_run",
                evaluators: [
                    {
                        path: setup.outputNotNullEvaluator.path,
                    },
                ],
            });

            // Wait for evaluation to complete
            await new Promise((resolve) => setTimeout(resolve, 5000));

            const evalResponse = await humanloopClient.evaluations.list({
                fileId: setup.evalPrompt.id,
            });
            expect(evalResponse.data.length).toBe(1);

            const evaluationId = evalResponse.data[0].id;
            const runsResponse =
                await humanloopClient.evaluations.listRunsForEvaluation(evaluationId);
            expect(runsResponse.runs[0].status).toBe("completed");
        } finally {
            // Clean up test-specific resources
            await cleanupTestEnvironment(setup);
        }
    });

    it("should run evaluation with version_id", async () => {
        // Setup test-specific environment
        const setup = await setupTestEnvironment("version_id");

        try {
            // Create a new prompt version
            const newPromptVersionResponse = await humanloopClient.prompts.upsert({
                path: setup.evalPrompt.path,
                provider: "openai",
                model: "gpt-4o-mini",
                temperature: 0,
                template: [
                    {
                        role: "system",
                        content:
                            "You are a helpful assistant. You must answer the user's question truthfully and at the level of a 5th grader.",
                    },
                    {
                        role: "user",
                        content: "{{question}}",
                    },
                ],
            });

            // Run evaluation with version_id
            await humanloopClient.evaluations.run({
                file: {
                    id: newPromptVersionResponse.id,
                    versionId: newPromptVersionResponse.versionId,
                    type: "prompt",
                },
                dataset: {
                    path: setup.evalDataset.path,
                },
                name: "test_eval_run",
                evaluators: [
                    {
                        path: setup.outputNotNullEvaluator.path,
                    },
                ],
            });

            // Verify evaluation
            const evaluationsResponse = await humanloopClient.evaluations.list({
                fileId: newPromptVersionResponse.id,
            });
            expect(evaluationsResponse.data.length).toBe(1);

            const evaluationId = evaluationsResponse.data[0].id;
            const runsResponse =
                await humanloopClient.evaluations.listRunsForEvaluation(evaluationId);
            expect(runsResponse.runs[0].status).toBe("completed");
            if (runsResponse.runs[0].version) {
                expect(runsResponse.runs[0].version.versionId).toBe(
                    newPromptVersionResponse.versionId,
                );
            }

            // Verify version is not the default
            const response = await humanloopClient.prompts.get(
                newPromptVersionResponse.id,
            );
            expect(response.versionId).not.toBe(newPromptVersionResponse.versionId);
        } finally {
            // Clean up test-specific resources
            await cleanupTestEnvironment(setup);
        }
    });

    it("should run evaluation with environment", async () => {
        // Setup test-specific environment
        const setup = await setupTestEnvironment("environment");

        try {
            // Create a new prompt version and deploy to staging
            const newPromptVersionResponse = await humanloopClient.prompts.upsert({
                path: setup.evalPrompt.path,
                provider: "openai",
                model: "gpt-4o-mini",
                temperature: 0,
                template: [
                    {
                        role: "system",
                        content:
                            "You are a helpful assistant. You must answer the user's question truthfully and at the level of a 5th grader.",
                    },
                    {
                        role: "user",
                        content: "{{question}}",
                    },
                ],
            });

            await humanloopClient.prompts.setDeployment(
                newPromptVersionResponse.id,
                setup.stagingEnvironmentId,
                {
                    versionId: newPromptVersionResponse.versionId,
                },
            );

            // Run evaluation with environment
            await humanloopClient.evaluations.run({
                file: {
                    id: newPromptVersionResponse.id,
                    type: "prompt",
                    environment: "staging",
                },
                dataset: {
                    path: setup.evalDataset.path,
                },
                name: "test_eval_run",
                evaluators: [
                    {
                        path: setup.outputNotNullEvaluator.path,
                    },
                ],
            });

            // Verify evaluation
            const evaluationsResponse = await humanloopClient.evaluations.list({
                fileId: newPromptVersionResponse.id,
            });
            expect(evaluationsResponse.data.length).toBe(1);

            const evaluationId = evaluationsResponse.data[0].id;
            const runsResponse =
                await humanloopClient.evaluations.listRunsForEvaluation(evaluationId);
            expect(runsResponse.runs[0].status).toBe("completed");
            if (runsResponse.runs[0].version) {
                expect(runsResponse.runs[0].version.versionId).toBe(
                    newPromptVersionResponse.versionId,
                );
            }

            const defaultPromptVersionResponse = await humanloopClient.prompts.get(
                newPromptVersionResponse.id,
            );
            expect(defaultPromptVersionResponse.versionId).not.toBe(
                newPromptVersionResponse.versionId,
            );
        } finally {
            // Clean up test-specific resources
            await cleanupTestEnvironment(setup);
        }
    });

    it("should fail when using version_id with path", async () => {
        // Setup test-specific environment
        const setup = await setupTestEnvironment("fail_with_version_id");

        try {
            try {
                await humanloopClient.evaluations.run({
                    file: {
                        path: setup.evalPrompt.path,
                        type: "prompt",
                        versionId: "will_not_work",
                    },
                    dataset: {
                        path: setup.evalDataset.path,
                    },
                    name: "test_eval_run",
                    evaluators: [
                        {
                            path: setup.outputNotNullEvaluator.path,
                        },
                    ],
                });
                // If we got here, the test failed
                throw new Error("Expected runtime error but none was thrown");
            } catch (error: any) {
                if (error instanceof HumanloopRuntimeError) {
                    expect(error.message).toContain(
                        "You must provide the `file.id` when addressing a file by version ID or environment",
                    );
                } else {
                    throw new Error(
                        `Expected test to fail for version_id but got ${error}`,
                    );
                }
            }
        } finally {
            // Clean up test-specific resources
            await cleanupTestEnvironment(setup);
        }
    });

    it("should fail when using environment with path", async () => {
        // Setup test-specific environment
        const setup = await setupTestEnvironment("fail_with_environment");

        try {
            await humanloopClient.evaluations.run({
                file: {
                    path: setup.evalPrompt.path,
                    type: "prompt",
                    environment: "staging",
                },
                dataset: {
                    path: setup.evalDataset.path,
                },
                name: "test_eval_run",
                evaluators: [
                    {
                        path: setup.outputNotNullEvaluator.path,
                    },
                ],
            });
            // If we got here, the test failed
            throw new Error("Expected runtime error but none was thrown");
        } catch (error: any) {
            if (error instanceof HumanloopRuntimeError) {
                expect(error.message).toContain(
                    "You must provide the `file.id` when addressing a file by version ID or environment",
                );
            } else {
                throw new Error(
                    `Expected test to fail for environment but got ${error}`,
                );
            }
        } finally {
            // Clean up test-specific resources
            await cleanupTestEnvironment(setup);
        }
    });

    it("should run evaluation with version upsert", async () => {
        // Setup test-specific environment
        const setup = await setupTestEnvironment("version_upsert");

        try {
            await humanloopClient.evaluations.run({
                file: {
                    path: setup.evalPrompt.path,
                    type: "prompt",
                    version: {
                        provider: "openai",
                        model: "gpt-4o-mini",
                        temperature: 1,
                        template: [
                            {
                                role: "system",
                                content:
                                    "You are a helpful assistant. You must answer the user's question truthfully and at the level of a 5th grader.",
                            },
                            {
                                role: "user",
                                content: "{{question}}",
                            },
                        ],
                    },
                },
                dataset: {
                    path: setup.evalDataset.path,
                },
                name: "test_eval_run",
                evaluators: [
                    {
                        path: setup.outputNotNullEvaluator.path,
                    },
                ],
            });

            // Verify evaluation
            const evaluationsResponse = await humanloopClient.evaluations.list({
                fileId: setup.evalPrompt.id,
            });
            expect(evaluationsResponse.data.length).toBe(1);

            const evaluationId = evaluationsResponse.data[0].id;
            const runsResponse =
                await humanloopClient.evaluations.listRunsForEvaluation(evaluationId);
            expect(runsResponse.runs[0].status).toBe("completed");

            // Verify version upsert
            const listPromptVersionsResponse =
                await humanloopClient.prompts.listVersions(setup.evalPrompt.id);
            expect(listPromptVersionsResponse.records.length).toBe(2);
        } finally {
            // Clean up test-specific resources
            await cleanupTestEnvironment(setup);
        }
    });

    it("should fail flow eval without callable", async () => {
        // Setup test-specific environment
        const setup = await setupTestEnvironment("flow_fail_without_callable");

        try {
            try {
                await humanloopClient.evaluations.run({
                    file: {
                        path: "Test Flow",
                        type: "flow",
                        version: {
                            attributes: {
                                foo: "bar",
                            },
                        },
                    },
                    dataset: {
                        path: setup.evalDataset.path,
                    },
                    name: "test_eval_run",
                    evaluators: [
                        {
                            path: setup.outputNotNullEvaluator.path,
                        },
                    ],
                });
                // If we got here, the test failed
                fail("Expected runtime error but none was thrown");
            } catch (error: any) {
                expect(error.message).toContain(
                    "You must provide a `callable` for your Flow `file` to run a local eval.",
                );
            }
        } finally {
            // Clean up test-specific resources
            await cleanupTestEnvironment(setup);
        }
    });

    it("should run flow eval with callable", async () => {
        // Setup test-specific environment
        const setup = await setupTestEnvironment("flow_with_callable");

        try {
            const flowPath = `${setup.sdkTestDir.path}/Test Flow`;

            // Create flow
            const flowResponse = await humanloopClient.flows.upsert({
                path: flowPath,
                attributes: {
                    foo: "bar",
                },
            });

            try {
                const flow = await humanloopClient.flows.upsert({
                    path: flowPath,
                    attributes: {
                        foo: "bar",
                    },
                });

                // Run evaluation with flow
                await humanloopClient.evaluations.run({
                    file: {
                        id: flow.id,
                        type: "flow",
                        callable: ({ question }) =>
                            "It's complicated don't worry about it",
                        version: {
                            attributes: {
                                foo: "bar",
                            },
                        },
                    },
                    dataset: {
                        path: setup.evalDataset.path,
                    },
                    name: "test_eval_run",
                    evaluators: [
                        {
                            path: setup.outputNotNullEvaluator.path,
                        },
                    ],
                });

                // Verify evaluation
                const evaluationsResponse = await humanloopClient.evaluations.list({
                    fileId: flow.id,
                });
                expect(evaluationsResponse.data.length).toBe(1);

                const evaluationId = evaluationsResponse.data[0].id;
                const runsResponse =
                    await humanloopClient.evaluations.listRunsForEvaluation(
                        evaluationId,
                    );
                expect(runsResponse.runs[0].status).toBe("completed");
            } finally {
                await humanloopClient.flows.delete(flowResponse.id);
            }
        } finally {
            // Clean up test-specific resources
            await cleanupTestEnvironment(setup);
        }
    });

    it("should not allow evaluating agent with callable", async () => {
        // Setup test-specific environment
        const setup = await setupTestEnvironment("agent_with_callable");

        try {
            try {
                await humanloopClient.evaluations.run({
                    file: {
                        path: "Test Agent",
                        type: "agent",
                        callable: (inputs: any) => "bar",
                    },
                    dataset: {
                        path: setup.evalDataset.path,
                    },
                    name: "test_eval_run",
                    evaluators: [
                        {
                            path: setup.outputNotNullEvaluator.path,
                        },
                    ],
                });
                // If we got here, the test failed
                fail("Expected ValueError but none was thrown");
            } catch (error: any) {
                expect(error.message).toBe(
                    "Agent evaluation is only possible on the Humanloop runtime, do not provide a `callable`.",
                );
            }
        } finally {
            // Clean up test-specific resources
            await cleanupTestEnvironment(setup);
        }
    });

    it("should resolve to default flow version when callable is provided without version", async () => {
        // Setup test-specific environment
        const setup = await setupTestEnvironment("flow_with_callable_without_version");
        let flowResponse: FlowResponse;
        try {
            const flowPath = `${setup.sdkTestDir.path}/Test Flow`;

            // Create flow
            flowResponse = await humanloopClient.flows.upsert({
                path: flowPath,
                attributes: {
                    foo: "bar",
                },
            });

            // Run evaluation with flow
            await humanloopClient.evaluations.run({
                file: {
                    id: flowResponse.id,
                    type: "flow",
                    callable: ({ question }) => "It's complicated don't worry about it",
                },
                dataset: {
                    path: setup.evalDataset.path,
                },
                name: "test_eval_run",
                evaluators: [
                    {
                        path: setup.outputNotNullEvaluator.path,
                    },
                ],
            });

            // Verify evaluation
            const evaluationsResponse = await humanloopClient.evaluations.list({
                fileId: flowResponse.id,
            });
            expect(evaluationsResponse.data.length).toBe(1);

            const evaluationId = evaluationsResponse.data[0].id;
            const runsResponse =
                await humanloopClient.evaluations.listRunsForEvaluation(evaluationId);
            expect(runsResponse.runs[0].status).toBe("completed");
        } finally {
            // Clean up test-specific resources
            await cleanupTestEnvironment(setup, [
                { id: flowResponse!.id, type: "flow" },
            ]);
        }
    });
});
