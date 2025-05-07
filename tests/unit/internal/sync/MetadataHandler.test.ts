import * as fs from "fs";
import * as path from "path";

import MetadataHandler from "../../../../src/sync/MetadataHandler";

// Mock fs module
jest.mock("fs");

describe("MetadataHandler", () => {
    let metadataHandler: MetadataHandler;
    const testBaseDir = "/test/dir";
    const mockMetadataFile = path.join(testBaseDir, ".sync_metadata.json");

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();

        // Mock fs.existsSync to return false initially (file doesn't exist)
        (fs.existsSync as jest.Mock).mockReturnValue(false);

        // Mock fs.mkdirSync to do nothing
        (fs.mkdirSync as jest.Mock).mockImplementation(() => {});

        // Mock fs.writeFileSync to do nothing
        (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

        // Mock fs.readFileSync to return initial state
        (fs.readFileSync as jest.Mock).mockReturnValue(
            JSON.stringify({ last_operation: null, history: [] }),
        );
    });

    describe("initialization", () => {
        it("should create metadata file if it does not exist", () => {
            metadataHandler = new MetadataHandler(testBaseDir);
            expect(fs.existsSync).toHaveBeenCalledWith(mockMetadataFile);
            expect(fs.writeFileSync).toHaveBeenCalledWith(
                mockMetadataFile,
                JSON.stringify({ last_operation: null, history: [] }, null, 2),
            );
        });

        it("should not create metadata file if it already exists", () => {
            // Reset mocks
            jest.clearAllMocks();

            // Mock that file exists
            (fs.existsSync as jest.Mock).mockReturnValue(true);

            // Mock readFileSync to return existing data
            (fs.readFileSync as jest.Mock).mockReturnValue(
                JSON.stringify({ last_operation: null, history: [] }),
            );

            metadataHandler = new MetadataHandler(testBaseDir);

            expect(fs.writeFileSync).not.toHaveBeenCalled();
        });
    });

    describe("logOperation", () => {
        it("should log operation with all fields", () => {
            metadataHandler = new MetadataHandler(testBaseDir);
            const params = {
                operationType: "pull",
                path: "test/path",
                environment: "dev",
                successfulFiles: ["test/path/file1.prompt", "test/path/file2.prompt"],
                failedFiles: ["test/path/file3.prompt"],
                error: "Test error",
                duration_ms: 1000,
            };

            metadataHandler.logOperation(params);

            expect(fs.writeFileSync).toHaveBeenCalledWith(
                mockMetadataFile,
                expect.stringContaining('"operation_type": "pull"'),
            );
            expect(fs.writeFileSync).toHaveBeenCalledWith(
                mockMetadataFile,
                expect.stringContaining('"path": "test/path"'),
            );
            expect(fs.writeFileSync).toHaveBeenCalledWith(
                mockMetadataFile,
                expect.stringContaining('"environment": "dev"'),
            );
        });

        it("should maintain history within max size", () => {
            // First, initialize the MetadataHandler
            metadataHandler = new MetadataHandler(testBaseDir);

            // Clear the writeFileSync mock to reset the call history after initialization
            (fs.writeFileSync as jest.Mock).mockClear();

            // Create a history array with 5 items
            const existingHistory = Array(5)
                .fill(null)
                .map(() => ({
                    timestamp: new Date().toISOString(),
                    operation_type: "pull",
                    path: "/test/path",
                    successful_files: [],
                    failed_files: [],
                    duration_ms: 1000,
                }));

            // NOW set up the stateful mock AFTER initialization
            // This prevents the ensureMetadataFile from overwriting our test data
            (fs.readFileSync as jest.Mock).mockReturnValue(
                JSON.stringify({
                    last_operation: existingHistory[0],
                    history: existingHistory,
                }),
            );

            const params = {
                operationType: "pull",
                path: "/new/path",
                duration_ms: 750,
            };

            metadataHandler.logOperation(params);

            // Get the last call to writeFileSync
            const lastCallArgs = (fs.writeFileSync as jest.Mock).mock.calls[0];
            const writtenData = JSON.parse(lastCallArgs[1]);

            // The history should still have 5 items (max size) after adding a new one
            expect(writtenData.history.length).toBe(5);

            // The new operation should be at the start of the array
            expect(writtenData.history[0].operation_type).toBe("pull");
            expect(writtenData.history[0].path).toBe("/new/path");
            expect(writtenData.history[0].duration_ms).toBe(750);
        });

        it("should handle empty history array", () => {
            metadataHandler = new MetadataHandler(testBaseDir);

            const params = {
                operationType: "pull",
                path: "test/path",
                duration_ms: 500,
            };

            metadataHandler.logOperation(params);

            const lastCallArgs = (fs.writeFileSync as jest.Mock).mock.calls.slice(
                -1,
            )[0];
            const writtenData = JSON.parse(lastCallArgs[1]);

            expect(writtenData.history.length).toBe(1);
            expect(writtenData.history[0].operation_type).toBe("pull");
            expect(writtenData.history[0].path).toBe("test/path");
        });

        it("should handle missing optional fields", () => {
            metadataHandler = new MetadataHandler(testBaseDir);

            const params = {
                operationType: "pull",
                path: "test/path",
                duration_ms: 500,
            };

            metadataHandler.logOperation(params);

            const lastCallArgs = (fs.writeFileSync as jest.Mock).mock.calls.slice(
                -1,
            )[0];
            const writtenData = JSON.parse(lastCallArgs[1]);

            expect(writtenData.history[0].successful_files).toEqual([]);
            expect(writtenData.history[0].failed_files).toEqual([]);
            expect(writtenData.history[0].environment).toBeUndefined();
            expect(writtenData.history[0].error).toBeUndefined();
        });
    });

    describe("getLastOperation", () => {
        it("should return the last operation", () => {
            const operation = {
                timestamp: new Date().toISOString(),
                operation_type: "pull",
                path: "test/path",
                successful_files: [],
                failed_files: [],
                duration_ms: 1000,
            };

            // Mock readFileSync to return a state with a last operation
            (fs.readFileSync as jest.Mock).mockReturnValue(
                JSON.stringify({
                    last_operation: operation,
                    history: [operation],
                }),
            );

            metadataHandler = new MetadataHandler(testBaseDir);
            const result = metadataHandler.getLastOperation();

            expect(result).toEqual(operation);
        });

        it("should return null if no operations exist", () => {
            // Mock readFileSync to return empty state
            (fs.readFileSync as jest.Mock).mockReturnValue(
                JSON.stringify({
                    last_operation: null,
                    history: [],
                }),
            );

            metadataHandler = new MetadataHandler(testBaseDir);
            const result = metadataHandler.getLastOperation();

            expect(result).toBeNull();
        });
    });

    describe("getHistory", () => {
        it("should return the operation history", () => {
            const operations = Array(3)
                .fill(null)
                .map((_, i) => ({
                    timestamp: new Date().toISOString(),
                    operation_type: "pull",
                    path: `test/path${i}`,
                    successful_files: [],
                    failed_files: [],
                    duration_ms: 1000 + i,
                }));

            // Mock readFileSync to return a state with history
            (fs.readFileSync as jest.Mock).mockReturnValue(
                JSON.stringify({
                    last_operation: operations[0],
                    history: operations,
                }),
            );

            metadataHandler = new MetadataHandler(testBaseDir);
            const result = metadataHandler.getHistory();

            expect(result).toEqual(operations);
            expect(result.length).toBe(3);
        });

        it("should return empty array if no history exists", () => {
            // Mock readFileSync to return empty state
            (fs.readFileSync as jest.Mock).mockReturnValue(
                JSON.stringify({
                    last_operation: null,
                    history: [],
                }),
            );

            metadataHandler = new MetadataHandler(testBaseDir);
            const result = metadataHandler.getHistory();

            expect(result).toEqual([]);
        });
    });
});
