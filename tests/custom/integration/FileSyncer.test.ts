import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

import { FileType } from "../../../src/api";
import { HumanloopRuntimeError } from "../../../src/error";
import { HumanloopClient } from "../../../src/humanloop.client";
import { createTempDir } from "../fixtures";
import {
    SyncableFile,
    TestSetup,
    cleanupTestEnvironment,
    createSyncableFilesFixture,
    setupTestEnvironment,
} from "./fixtures";

describe("FileSyncer Integration Tests", () => {
    let testSetup: TestSetup;
    let syncableFiles: SyncableFile[] = [];
    let tempDirInfo: { tempDir: string; cleanup: () => void };

    beforeAll(async () => {
        // Set up test environment
        testSetup = await setupTestEnvironment("file_sync");
        tempDirInfo = createTempDir("file-sync-integration");

        // Create test files in Humanloop for syncing
        syncableFiles = await createSyncableFilesFixture(testSetup);
    });

    afterAll(async () => {
        // Clean up resources only if they were created
        if (tempDirInfo) {
            tempDirInfo.cleanup();
        }
        if (testSetup) {
            await cleanupTestEnvironment(
                testSetup,
                syncableFiles.map((file) => ({
                    type: file.type as FileType,
                    id: file.id as string,
                })),
            );
        }
    }, 30000);

    test("pull_basic: should pull all files from remote to local filesystem", async () => {
        // GIVEN a set of files in the remote system (from syncableFiles)
        const client = new HumanloopClient({
            apiKey: process.env.HUMANLOOP_API_KEY,
            localFilesDirectory: tempDirInfo.tempDir,
            useLocalFiles: true,
        });

        // WHEN running the pull operation
        await client.pull();

        // THEN our local filesystem should mirror the remote filesystem in the HL Workspace
        for (const file of syncableFiles) {
            const extension = `.${file.type}`;
            const localPath = path.join(
                tempDirInfo.tempDir,
                `${file.path}${extension}`,
            );

            // THEN the file and its directory should exist
            expect(fs.existsSync(localPath)).toBe(true);
            expect(fs.existsSync(path.dirname(localPath))).toBe(true);

            // THEN the file should not be empty
            const content = fs.readFileSync(localPath, "utf8");
            expect(content).toBeTruthy();
        }
    }, 30000);

    test("pull_with_invalid_path: should handle error when path doesn't exist", async () => {
        // GIVEN a client
        const client = new HumanloopClient({
            apiKey: process.env.HUMANLOOP_API_KEY,
            localFilesDirectory: tempDirInfo.tempDir,
            useLocalFiles: true,
        });

        const nonExistentPath = `${testSetup.sdkTestDir.path}/non_existent_directory`;

        // WHEN/THEN pulling with an invalid path should throw an error
        await expect(client.pull(nonExistentPath)).rejects.toThrow(
            HumanloopRuntimeError,
        );
        // The error message might be different in TypeScript, so we don't assert on the exact message
    });

    test("pull_with_invalid_environment: should handle error when environment doesn't exist", async () => {
        // GIVEN a client
        const client = new HumanloopClient({
            apiKey: process.env.HUMANLOOP_API_KEY,
            localFilesDirectory: tempDirInfo.tempDir,
            useLocalFiles: true,
        });

        // WHEN/THEN pulling with an invalid environment should throw an error
        await expect(client.pull(undefined, "invalid_environment")).rejects.toThrow(
            HumanloopRuntimeError,
        );
    });

    test("pull_with_path_filter: should only pull files from specified path", async () => {
        // GIVEN a client and a clean temp directory
        const pathFilterTempDir = createTempDir("file-sync-path-filter");

        const client = new HumanloopClient({
            apiKey: process.env.HUMANLOOP_API_KEY,
            localFilesDirectory: pathFilterTempDir.tempDir,
            useLocalFiles: true,
        });

        // WHEN pulling only files from the testSetup.sdkTestDir.path
        await client.pull(testSetup.sdkTestDir.path);

        // THEN count the total number of files pulled
        let pulledFileCount = 0;

        // Collect expected file paths (relative to sdkTestDir.path)
        const expectedFiles = new Set(
            syncableFiles.map((file) =>
                path.join(
                    pathFilterTempDir.tempDir,
                    file.path + (file.type === "prompt" ? ".prompt" : ".agent"),
                ),
            ),
        );

        const foundFiles = new Set<string>();

        function countFilesRecursive(dirPath: string): void {
            const entries = fs.readdirSync(dirPath, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);
                if (entry.isDirectory()) {
                    countFilesRecursive(fullPath);
                } else if (entry.isFile()) {
                    if (expectedFiles.has(fullPath)) {
                        const content = fs.readFileSync(fullPath, "utf8");
                        expect(content).toBeTruthy();
                        foundFiles.add(fullPath);
                    }
                }
            }
        }

        if (fs.existsSync(pathFilterTempDir.tempDir)) {
            countFilesRecursive(pathFilterTempDir.tempDir);
        }

        expect(foundFiles.size).toBe(expectedFiles.size);

        // Clean up
        pathFilterTempDir.cleanup();
    });
});
