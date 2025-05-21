import * as fs from "fs";
import * as path from "path";
import { spawn } from "child_process";

import { createTempDir } from "../fixtures";
import {
    TestSetup,
    cleanupTestEnvironment,
    createSyncableFilesFixture,
    setupTestEnvironment,
} from "./fixtures";

// Set global timeout for all tests in this suite
jest.setTimeout(40 * 1000); // 40 seconds

/**
 * Runs the Humanloop CLI as a child process, executing the TypeScript source directly.
 *
 * This function is used in integration tests to verify CLI behavior. Instead of using
 * the compiled JavaScript file (dist/cli.js), it runs the TypeScript source (src/cli.ts)
 * directly using ts-node. This approach:
 *
 * 1. Eliminates the need for a build step before running tests
 * 2. Ensures tests always run against the latest source code
 * 3. Maintains process isolation for proper CLI testing
 *
 * Implementation details:
 * - Uses child_process.spawn to run the CLI in a separate process
 * - Uses npx to execute ts-node without requiring it as a dependency
 * - Captures stdout/stderr for assertion in tests
 * - Returns a promise that resolves with the command output and exit code
 *
 * Environment setup:
 * - Modifies PATH to prioritize the project's node_modules/.bin
 * - This ensures we use the project's TypeScript version
 * - Preserves all other environment variables
 *
 * Example usage:
 * ```typescript
 * const result = await runCli([
 *   "pull",
 *   "--local-files-directory",
 *   tempDir,
 *   "--verbose"
 * ]);
 * expect(result.exitCode).toBe(0);
 * expect(result.stdout).toContain("Pull completed");
 * ```
 *
 * @param args - Array of command line arguments to pass to the CLI
 * @returns Promise resolving to an object containing:
 *   - stdout: Standard output of the command
 *   - stderr: Standard error of the command
 *   - exitCode: Exit code of the process (0 for success)
 */
async function runCli(
    args: string[],
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    return new Promise((resolve) => {
        const packageRoot = path.resolve(__dirname, "../../../");
        // Use ts-node to run the TypeScript source directly
        const cliPath = path.join(packageRoot, "src/cli.ts");

        // Use spawn with ts-node to execute the TypeScript file
        const childProcess = spawn("npx", ["ts-node", cliPath, ...args], {
            stdio: ["ignore", "pipe", "pipe"],
            // Ensure we use the project's ts-node and typescript
            env: {
                ...process.env,
                PATH: `${packageRoot}/node_modules/.bin:${process.env.PATH}`,
            },
        });

        let stdout = "";
        let stderr = "";

        childProcess.stdout?.on("data", (data) => {
            stdout += data.toString();
        });

        childProcess.stderr?.on("data", (data) => {
            stderr += data.toString();
        });

        childProcess.on("close", (code) => {
            resolve({
                stdout,
                stderr,
                exitCode: code !== null ? code : 0,
            });
        });
    });
}

describe("CLI Integration Tests", () => {
    let testSetup: TestSetup;
    let syncableFiles: any[] = [];

    beforeAll(async () => {
        // Set up test environment
        testSetup = await setupTestEnvironment("cli_test");

        // Create test files in Humanloop for syncing
        syncableFiles = await createSyncableFilesFixture(testSetup);
    });

    afterAll(async () => {
        await cleanupTestEnvironment(
            testSetup,
            syncableFiles.map((file) => ({
                type: file.type as any,
                id: file.id as string,
            })),
        );
    });

    test("pull_basic: should pull all files successfully", async () => {
        // GIVEN a base directory for pulled files
        const { tempDir, cleanup } = createTempDir("cli-basic-pull");

        // WHEN running pull command
        const result = await runCli([
            "pull",
            "--local-files-directory",
            tempDir,
            "--verbose",
            "--api-key",
            process.env.HUMANLOOP_API_KEY || "",
        ]);

        // THEN it should succeed
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toContain("Pulling files from Humanloop");
        expect(result.stdout).toContain("Pull completed");

        // THEN the files should exist locally
        for (const file of syncableFiles) {
            const extension = `.${file.type}`;
            const localPath = path.join(tempDir, `${file.path}${extension}`);

            expect(fs.existsSync(localPath)).toBe(true);
            expect(fs.existsSync(path.dirname(localPath))).toBe(true);

            const content = fs.readFileSync(localPath, "utf8");
            expect(content).toBeTruthy();
        }

        cleanup();
    });

    test("pull_with_specific_path: should pull files from a specific path", async () => {
        // GIVEN a base directory and specific path
        const { tempDir, cleanup } = createTempDir("cli-path-pull");

        // Get the prefix of the first file's path (test directory)
        const testPath = syncableFiles[0].path.split("/")[0];

        // WHEN running pull command with path
        const result = await runCli([
            "pull",
            "--local-files-directory",
            tempDir,
            "--path",
            testPath,
            "--verbose",
            "--api-key",
            process.env.HUMANLOOP_API_KEY || "",
        ]);

        // THEN it should succeed and show the path
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toContain(`Path: ${testPath}`);

        // THEN only files from that path should exist locally
        for (const file of syncableFiles) {
            const extension = `.${file.type}`;
            const localPath = path.join(tempDir, `${file.path}${extension}`);

            if (file.path.startsWith(testPath)) {
                expect(fs.existsSync(localPath)).toBe(true);
            } else {
                expect(fs.existsSync(localPath)).toBe(false);
            }
        }

        cleanup();
    });

    test("pull_with_environment: should pull files from a specific environment", async () => {
        // GIVEN a base directory and environment
        const { tempDir, cleanup } = createTempDir("cli-env-pull");

        // WHEN running pull command with environment
        const result = await runCli([
            "pull",
            "--local-files-directory",
            tempDir,
            "--environment",
            "staging",
            "--verbose",
            "--api-key",
            process.env.HUMANLOOP_API_KEY || "",
        ]);

        // THEN it should succeed and show the environment
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toContain("Environment: staging");

        cleanup();
    });

    test("pull_with_quiet_mode: should pull files with quiet mode enabled", async () => {
        // GIVEN a base directory and quiet mode
        const { tempDir, cleanup } = createTempDir("cli-quiet-pull");

        // WHEN running pull command with quiet mode
        const result = await runCli([
            "pull",
            "--local-files-directory",
            tempDir,
            "--quiet",
            "--api-key",
            process.env.HUMANLOOP_API_KEY || "",
        ]);

        // THEN it should succeed but not show file list
        expect(result.exitCode).toBe(0);
        expect(result.stdout).not.toContain("Successfully pulled");

        // THEN files should still be pulled
        for (const file of syncableFiles) {
            const extension = `.${file.type}`;
            const localPath = path.join(tempDir, `${file.path}${extension}`);
            expect(fs.existsSync(localPath)).toBe(true);
        }

        cleanup();
    });

    test("pull_with_invalid_path: should handle error when pulling from an invalid path", async () => {
        // GIVEN an invalid path
        const { tempDir, cleanup } = createTempDir("cli-invalid-path");
        const path = "nonexistent/path";

        // WHEN running pull command
        const result = await runCli([
            "pull",
            "--local-files-directory",
            tempDir,
            "--path",
            path,
            "--api-key",
            process.env.HUMANLOOP_API_KEY || "",
        ]);

        // THEN it should fail
        expect(result.exitCode).toBe(1);
        expect(result.stderr + result.stdout).toContain("Error");

        cleanup();
    });

    test("pull_with_invalid_environment: should handle error when pulling from an invalid environment", async () => {
        // GIVEN an invalid environment
        const { tempDir, cleanup } = createTempDir("cli-invalid-env");
        const environment = "nonexistent";

        // WHEN running pull command
        const result = await runCli([
            "pull",
            "--local-files-directory",
            tempDir,
            "--environment",
            environment,
            "--verbose",
            "--api-key",
            process.env.HUMANLOOP_API_KEY || "",
        ]);

        // THEN it should fail
        expect(result.exitCode).toBe(1);
        expect(result.stderr + result.stdout).toContain("Error");

        cleanup();
    });
});
