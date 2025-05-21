import * as path from "path";

/**
 * Normalize a path to the standard Humanloop API format.
 *
 * This function is primarily used when interacting with the Humanloop API to ensure paths
 * follow the standard format: 'path/to/resource' without leading/trailing slashes.
 * It's used when pulling files from Humanloop to local filesystem (see FileSyncer.pull)
 *
 * The function:
 * - Converts Windows backslashes to forward slashes
 * - Normalizes consecutive slashes
 * - Optionally strips file extensions (e.g. .prompt, .agent)
 * - Removes leading/trailing slashes to match API conventions
 *
 * Leading/trailing slashes are stripped because the Humanloop API expects paths in the
 * format 'path/to/resource' without them. This is consistent with how the API stores
 * and references files, and ensures paths work correctly in both API calls and local
 * filesystem operations.
 *
 * @param pathStr - The path to normalize. Can be a Windows or Unix-style path.
 * @param stripExtension - If true, removes the file extension (e.g. .prompt, .agent)
 * @returns Normalized path string in the format 'path/to/resource'
 */
export function normalizePath(
    pathStr: string,
    stripExtension: boolean = false,
): string {
    // Convert Windows backslashes to forward slashes
    let normalizedPath = pathStr.replace(/\\/g, "/");

    // Use path.posix to handle path normalization (handles consecutive slashes and . /..)
    normalizedPath = path.posix.normalize(normalizedPath);

    // Remove leading/trailing slashes
    normalizedPath = normalizedPath.replace(/^\/+|\/+$/g, "");

    // Strip extension if requested 
    if (stripExtension && normalizedPath.includes(".")) {
        normalizedPath = path.posix.join(
            path.posix.dirname(normalizedPath),
            path.posix.basename(normalizedPath, path.posix.extname(normalizedPath)),
        );
    }

    return normalizedPath;
}
