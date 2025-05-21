import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

import { HumanloopRuntimeError } from "../../src/error";
import FileSyncer, {
    SERIALIZABLE_FILE_TYPES,
    SerializableFileType,
} from "../../src/sync/FileSyncer";

// Mock for HumanloopClient
class MockHumanloopClient {
    files = {
        retrieveByPath: jest.fn(),
        listFiles: jest.fn(),
    };
}

describe("FileSyncer", () => {
    let mockClient: MockHumanloopClient;
    let fileSyncer: FileSyncer;
    let tempDir: string;

    beforeEach(() => {
        mockClient = new MockHumanloopClient();
        tempDir = path.join(process.cwd(), "test-tmp", uuidv4());

        // Create temporary directory
        fs.mkdirSync(tempDir, { recursive: true });

        fileSyncer = new FileSyncer(mockClient as any, {
            baseDir: tempDir,
            cacheSize: 10,
            verbose: true, // Enable verbose logging for tests
        });
    });

    afterEach(() => {
        // Clean up temporary files
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }

        // Clear all mocks
        jest.clearAllMocks();
    });

    describe("initialization", () => {
        it("should initialize with correct base directory, cache size and file types", () => {
            // Check that the FileSyncer is initialized with the correct properties
            expect(fileSyncer["baseDir"]).toBe(tempDir);
            expect(fileSyncer["cacheSize"]).toBe(10);
            expect(SERIALIZABLE_FILE_TYPES).toEqual(new Set(["prompt", "agent"]));
        });
    });

    describe("isFile", () => {
        it("should correctly identify prompt and agent files with case insensitivity", () => {
            // Standard lowercase extensions
            expect(fileSyncer.isFile("test.prompt")).toBe(true);
            expect(fileSyncer.isFile("test.agent")).toBe(true);

            // Uppercase extensions (case insensitivity)
            expect(fileSyncer.isFile("test.PROMPT")).toBe(true);
            expect(fileSyncer.isFile("test.AGENT")).toBe(true);
            expect(fileSyncer.isFile("test.Prompt")).toBe(true);
            expect(fileSyncer.isFile("test.Agent")).toBe(true);

            // With whitespace
            expect(fileSyncer.isFile(" test.prompt ")).toBe(true);
            expect(fileSyncer.isFile(" test.agent ")).toBe(true);
        });

        it("should return false for invalid or missing extensions", () => {
            // Invalid file types
            expect(fileSyncer.isFile("test.txt")).toBe(false);
            expect(fileSyncer.isFile("test.json")).toBe(false);
            expect(fileSyncer.isFile("test.py")).toBe(false);

            // No extension
            expect(fileSyncer.isFile("test")).toBe(false);
            expect(fileSyncer.isFile("prompt")).toBe(false);
            expect(fileSyncer.isFile("agent")).toBe(false);

            // Partial extensions
            expect(fileSyncer.isFile("test.prom")).toBe(false);
            expect(fileSyncer.isFile("test.age")).toBe(false);
        });
    });

    describe("file operations", () => {
        it("should save and read files correctly", () => {
            // Given a file content and path
            const content = "test content";
            const filePath = "test/path";
            const fileType: SerializableFileType = "prompt";

            // When saving the file
            fileSyncer["_saveSerializedFile"](content, filePath, fileType);

            // Then the file should exist on disk
            const savedPath = path.join(tempDir, filePath + "." + fileType);
            expect(fs.existsSync(savedPath)).toBe(true);

            // When reading the file
            const readContent = fileSyncer.getFileContent(filePath, fileType);

            // Then the content should match
            expect(readContent).toBe(content);
        });

        it("should throw an error when reading a nonexistent file", () => {
            // When trying to read a nonexistent file
            // Then a HumanloopRuntimeError should be raised
            expect(() => {
                fileSyncer.getFileContent("nonexistent", "prompt");
            }).toThrow(HumanloopRuntimeError);

            // Check that the error message contains expected text
            expect(() => {
                fileSyncer.getFileContent("nonexistent", "prompt");
            }).toThrow(/Failed to read/);
        });

        it("should return false when API calls fail during pull", async () => {
            // Given an API error
            mockClient.files.retrieveByPath.mockRejectedValue(new Error("API Error"));

            // When trying to pull a file
            const result = await fileSyncer["_pullFile"]("test.prompt");

            // Then it should return false
            expect(result).toBe(false);

            // And the API method should have been called
            expect(mockClient.files.retrieveByPath).toHaveBeenCalled();
        });
    });

    describe("cache functionality", () => {
        it("should cache file content and respect cache invalidation", () => {
            // Given a test file
            const content = "test content";
            const filePath = "test/path";
            const fileType: SerializableFileType = "prompt";
            fileSyncer["_saveSerializedFile"](content, filePath, fileType);

            // When reading the file for the first time
            const firstRead = fileSyncer.getFileContent(filePath, fileType);
            expect(firstRead).toBe(content);

            // When modifying the file on disk
            const savedPath = path.join(tempDir, filePath + "." + fileType);
            fs.writeFileSync(savedPath, "modified content");

            // Then subsequent reads should use cache (and return the original content)
            const secondRead = fileSyncer.getFileContent(filePath, fileType);
            expect(secondRead).toBe(content); // Should return cached content, not modified

            // When clearing the cache
            fileSyncer.clearCache();

            // Then new content should be read from disk
            const thirdRead = fileSyncer.getFileContent(filePath, fileType);
            expect(thirdRead).toBe("modified content");
        });

        it("should respect the cache size limit", () => {
            // Create a file syncer with small cache
            const smallCacheFileSyncer = new FileSyncer(mockClient as any, {
                baseDir: tempDir,
                cacheSize: 2, // Only 2 items in cache
            });

            // Save 3 different files
            for (let i = 1; i <= 3; i++) {
                const content = `content ${i}`;
                const filePath = `test/path${i}`;
                const fileType: SerializableFileType = "prompt";
                smallCacheFileSyncer["_saveSerializedFile"](
                    content,
                    filePath,
                    fileType,
                );

                // Read to put in cache
                smallCacheFileSyncer.getFileContent(filePath, fileType);
            }

            // Modify the first file (which should have been evicted from cache)
            const firstPath = "test/path1";
            const savedPath = path.join(tempDir, firstPath + ".prompt");
            fs.writeFileSync(savedPath, "modified content");

            // Reading the first file should get the modified content (not cached)
            const newContent = smallCacheFileSyncer.getFileContent(firstPath, "prompt");
            expect(newContent).toBe("modified content");

            // But reading the 2nd and 3rd files should still use cache
            expect(smallCacheFileSyncer.getFileContent("test/path2", "prompt")).toBe(
                "content 2",
            );
            expect(smallCacheFileSyncer.getFileContent("test/path3", "prompt")).toBe(
                "content 3",
            );
        });
    });

    describe("pull operations", () => {
        it("should handle successful file pull", async () => {
            // Mock successful file pull response
            mockClient.files.retrieveByPath.mockResolvedValue({
                type: "prompt",
                path: "test/path",
                rawFileContent: "pulled content",
            });

            // When pulling a file
            const result = await fileSyncer["_pullFile"]("test/path");

            // Then it should return true
            expect(result).toBe(true);

            // And the file should be saved to disk
            const savedPath = path.join(tempDir, "test/path.prompt");
            expect(fs.existsSync(savedPath)).toBe(true);
            expect(fs.readFileSync(savedPath, "utf8")).toBe("pulled content");
        });

        it("should handle unsuccessful file pull due to missing content", async () => {
            // Mock response with missing content
            mockClient.files.retrieveByPath.mockResolvedValue({
                type: "prompt",
                path: "test/path",
                // missing rawFileContent
            });

            // When pulling a file
            const result = await fileSyncer["_pullFile"]("test/path");

            // Then it should return false
            expect(result).toBe(false);
        });

        it("should handle unsuccessful file pull due to unsupported type", async () => {
            // Mock response with unsupported type
            mockClient.files.retrieveByPath.mockResolvedValue({
                type: "dataset", // Not a serializable type
                path: "test/path",
                rawFileContent: "content",
            });

            // When pulling a file
            const result = await fileSyncer["_pullFile"]("test/path");

            // Then it should return false
            expect(result).toBe(false);
        });

        it("should pull a directory of files", async () => {
            // Mock directory listing responses (paginated)
            mockClient.files.listFiles.mockResolvedValueOnce({
                records: [
                    {
                        type: "prompt",
                        path: "dir/file1",
                        rawFileContent: "content 1",
                    },
                    {
                        type: "agent",
                        path: "dir/file2",
                        rawFileContent: "content 2",
                    },
                ],
                page: 1,
                size: 2,
                total: 3,
            });

            mockClient.files.listFiles.mockResolvedValueOnce({
                records: [
                    {
                        type: "prompt",
                        path: "dir/file3",
                        rawFileContent: "content 3",
                    },
                ],
                page: 2,
                size: 2,
                total: 3,
            });

            // When pulling a directory
            const [successful, failed] = await fileSyncer["_pullDirectory"]("dir");

            // Then it should succeed for all files
            expect(successful.length).toBe(3);
            expect(failed.length).toBe(0);

            // And all files should exist on disk
            expect(fs.existsSync(path.join(tempDir, "dir/file1.prompt"))).toBe(true);
            expect(fs.existsSync(path.join(tempDir, "dir/file2.agent"))).toBe(true);
            expect(fs.existsSync(path.join(tempDir, "dir/file3.prompt"))).toBe(true);
        });

        it("should handle the main pull method with different path types", async () => {
            // Mock methods that are called by pull
            jest.spyOn(fileSyncer, "isFile").mockImplementation((p) =>
                p.endsWith(".prompt"),
            );
            jest.spyOn(fileSyncer as any, "_pullFile").mockResolvedValue(true);
            jest.spyOn(fileSyncer as any, "_pullDirectory").mockResolvedValue([
                ["dir/file1"],
                [],
            ]);

            // Test with file path
            await fileSyncer.pull("test/path.prompt");
            expect(fileSyncer["_pullFile"]).toHaveBeenCalledWith(
                "test/path",
                undefined,
            );

            // Reset mocks
            jest.clearAllMocks();

            // Test with directory path
            await fileSyncer.pull("test/dir");
            expect(fileSyncer["_pullDirectory"]).toHaveBeenCalledWith(
                "test/dir",
                undefined,
            );

            // Reset mocks
            jest.clearAllMocks();

            // Test with no path (root)
            await fileSyncer.pull();
            expect(fileSyncer["_pullDirectory"]).toHaveBeenCalledWith(
                undefined,
                undefined,
            );

            // Test with environment parameter
            await fileSyncer.pull("test/path.prompt", "staging");
            expect(fileSyncer["_pullFile"]).toHaveBeenCalledWith(
                "test/path",
                "staging",
            );
        });

        it("should reject paths with leading or trailing slashes", async () => {
            // Test with leading slash
            await expect(fileSyncer.pull("/test/path")).rejects.toThrow(
                HumanloopRuntimeError,
            );

            // Test with trailing slash
            await expect(fileSyncer.pull("test/path/")).rejects.toThrow(
                HumanloopRuntimeError,
            );
        });
    });
});
