import dotenv from "dotenv";
import { OpenAI } from "openai";
import { v4 as uuidv4 } from "uuid";

import { FileType, PromptRequest, PromptResponse } from "../../../src/api";
import { HumanloopClient } from "../../../src/humanloop.client";

export interface ResourceIdentifiers {
    id: string;
    path: string;
}

export interface TestPrompt {
    id: string;
    path: string;
    response: PromptResponse;
}

export interface SyncableFile {
    path: string;
    type: "prompt" | "agent";
    model: string;
    id?: string;
    versionId?: string;
}

export interface TestSetup {
    sdkTestDir: ResourceIdentifiers;
    testPromptConfig: PromptRequest;
    openaiApiKey: string;
    humanloopClient: HumanloopClient;
    evalDataset: ResourceIdentifiers;
    evalPrompt: ResourceIdentifiers;
    stagingEnvironmentId: string;
    outputNotNullEvaluator: ResourceIdentifiers;
}

export interface CleanupResources {
    type: FileType;
    id: string;
}

export function readEnvironment(): void {
    if (![process.env.HUMANLOOP_API_KEY, process.env.OPENAI_API_KEY].every(Boolean)) {
        // Testing locally not in CI, running dotenv.config() would override the secrets set for GitHub Action
        dotenv.config({});
    }
    if (!process.env.HUMANLOOP_API_KEY) {
        throw new Error("HUMANLOOP_API_KEY is not set");
    }
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is not set for integration tests");
    }
}

export function getSubclient(client: HumanloopClient, type: FileType) {
    switch (type) {
        case "prompt":
            return client.prompts;
        case "tool":
            return client.tools;
        case "flow":
            return client.flows;
        case "agent":
            return client.agents;
        case "dataset":
            return client.datasets;
        case "evaluator":
            return client.evaluators;
        default:
            throw new Error(`Unsupported file type: ${type}`);
    }
}

export async function setupTestEnvironment(testName: string): Promise<TestSetup> {
    readEnvironment();

    const openaiApiKey = process.env.OPENAI_API_KEY!;
    const humanloopClient = new HumanloopClient({
        apiKey: process.env.HUMANLOOP_API_KEY,
        instrumentProviders: {
            OpenAI: OpenAI,
        },
    });

    // Create a test directory
    const directoryPath = `SDK_TEST_${testName}_${uuidv4()}`;
    const response = await humanloopClient.directories.create({
        path: directoryPath,
    });

    const sdkTestDir = {
        id: response.id,
        path: response.path,
    };

    // Create test prompt config
    const testPromptConfig: PromptRequest = {
        provider: "openai",
        model: "gpt-4o-mini",
        temperature: 0.5,
        template: [
            {
                role: "system",
                content: "You are a helpful assistant. Answer concisely.",
            },
            {
                role: "user",
                content: "{{question}}",
            },
        ],
    };

    // Create evaluator for testing
    const evaluatorPath = `${sdkTestDir.path}/output_not_null_evaluator`;
    const evaluatorResponse = await humanloopClient.evaluators.upsert({
        path: evaluatorPath,
        spec: {
            argumentsType: "target_required",
            returnType: "boolean",
            code: `
def output_not_null(log: dict) -> bool:
    return log["output"] is not None
            `,
            evaluatorType: "python",
        },
    });
    const outputNotNullEvaluator = {
        id: evaluatorResponse.id,
        path: evaluatorPath,
    };

    // Create dataset for testing
    const datasetPath = `${sdkTestDir.path}/eval_dataset`;
    const datasetResponse = await humanloopClient.datasets.upsert({
        path: datasetPath,
        datapoints: [
            {
                inputs: { question: "What is the capital of the France?" },
                target: { output: "Paris" },
            },
            {
                inputs: { question: "What is the capital of the Germany?" },
                target: { output: "Berlin" },
            },
            {
                inputs: { question: "What is 2+2?" },
                target: { output: "4" },
            },
        ],
    });
    const evalDataset = {
        id: datasetResponse.id,
        path: datasetResponse.path,
    };

    // Create prompt
    const promptPath = `${sdkTestDir.path}/eval_prompt`;
    const promptResponse = await humanloopClient.prompts.upsert({
        path: promptPath,
        ...(testPromptConfig as PromptRequest),
    });
    const evalPrompt = {
        id: promptResponse.id,
        path: promptResponse.path,
    };

    // Get staging environment ID
    const environmentsResponse = await humanloopClient.prompts.listEnvironments(
        evalPrompt.id,
    );
    let stagingEnvironmentId = "";
    for (const environment of environmentsResponse) {
        if (environment.name === "staging") {
            stagingEnvironmentId = environment.id;
            break;
        }
    }
    if (!stagingEnvironmentId) {
        throw new Error("Staging environment not found");
    }

    return {
        testPromptConfig,
        openaiApiKey,
        humanloopClient,
        sdkTestDir,
        outputNotNullEvaluator,
        evalDataset,
        evalPrompt,
        stagingEnvironmentId,
    };
}

/**
 * Cleans up all test resources
 * @param setup The test setup containing the resources
 * @param resources Additional resources to clean up
 */
export async function cleanupTestEnvironment(
    setup: TestSetup,
    resources?: CleanupResources[],
): Promise<void> {
    try {
        // First clean up any additional resources
        if (resources) {
            for (const resource of resources) {
                const subclient = getSubclient(setup.humanloopClient, resource.type);
                if (resource.id) {
                    await subclient.delete(resource.id);
                }
            }
        }

        // Clean up fixed test resources
        if (setup.outputNotNullEvaluator?.id) {
            try {
                await setup.humanloopClient.evaluators.delete(
                    setup.outputNotNullEvaluator.id,
                );
            } catch (error) {
                console.warn(
                    `Failed to delete evaluator ${setup.outputNotNullEvaluator.id}:`,
                    error,
                );
            }
        }

        if (setup.evalDataset?.id) {
            try {
                await setup.humanloopClient.datasets.delete(setup.evalDataset.id);
            } catch (error) {
                console.warn(
                    `Failed to delete dataset ${setup.evalDataset.id}:`,
                    error,
                );
            }
        }

        // Finally, clean up the test directory
        if (setup.sdkTestDir.id) {
            try {
                await setup.humanloopClient.directories.delete(setup.sdkTestDir.id);
            } catch (error) {
                console.warn(
                    `Failed to delete directory ${setup.sdkTestDir.id}:`,
                    error,
                );
            }
        }
    } catch (error) {
        console.error("Error during cleanup:", error);
    }
}

/**
 * Creates a predefined structure of files in Humanloop for testing sync,
 * mirroring the Python syncable_files_fixture
 */
export async function createSyncableFilesFixture(
    testSetup: TestSetup,
): Promise<SyncableFile[]> {
    const fileDefinitions: SyncableFile[] = [
        {
            path: "prompts/gpt-4",
            type: "prompt",
            model: "gpt-4o-mini", // Using gpt-4o-mini as safer default for tests
        },
        {
            path: "prompts/gpt-4o",
            type: "prompt",
            model: "gpt-4o-mini",
        },
        {
            path: "prompts/nested/complex/gpt-4o",
            type: "prompt",
            model: "gpt-4o-mini",
        },
        {
            path: "agents/gpt-4",
            type: "agent",
            model: "gpt-4o-mini",
        },
        {
            path: "agents/gpt-4o",
            type: "agent",
            model: "gpt-4o-mini",
        },
    ];

    const createdFiles: SyncableFile[] = [];

    for (const file of fileDefinitions) {
        const fullPath = `${testSetup.sdkTestDir.path}/${file.path}`;
        let response;

        try {
            if (file.type === "prompt") {
                response = await testSetup.humanloopClient.prompts.upsert({
                    path: fullPath,
                    ...testSetup.testPromptConfig,
                    model: file.model,
                });
            } else if (file.type === "agent") {
                // Assuming agent creation works similar to your Python implementation
                response = await testSetup.humanloopClient.agents.upsert({
                    path: fullPath,
                    model: file.model,
                });
            }

            if (response) {
                createdFiles.push({
                    path: fullPath,
                    type: file.type,
                    model: file.model,
                    id: response.id,
                    versionId: response.versionId,
                });
            }
        } catch (error) {
            console.warn(`Failed to create ${file.type} at ${fullPath}: ${error}`);
        }
    }

    return createdFiles;
}
