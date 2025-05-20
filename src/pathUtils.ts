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
 *
 * @example
 * normalizePath("path/to/file.prompt")
 * // => 'path/to/file.prompt'
 *
 * @example
 * normalizePath("path/to/file.prompt", true)
 * // => 'path/to/file'
 *
 * @example
 * normalizePath("\\windows\\style\\path.prompt")
 * // => 'windows/style/path.prompt'
 *
 * @example
 * normalizePath("/leading/slash/path/")
 * // => 'leading/slash/path'
 *
 * @example
 * normalizePath("multiple//slashes//path")
 * // => 'multiple/slashes/path'
 */
export function normalizePath(
    pathStr: string,
    stripExtension: boolean = false,
): string {
    // Convert Windows backslashes to forward slashes
    const normalizedSeparators = pathStr.replace(/\\/g, "/");

    // Use path.posix to handle path normalization (handles consecutive slashes)
    // We use posix to ensure forward slashes are used consistently
    let normalizedPath = path.posix.normalize(normalizedSeparators);

    // Strip extension if requested
    if (stripExtension) {
        const ext = path.posix.extname(normalizedPath);
        normalizedPath = normalizedPath.slice(0, -ext.length);
    }

    // Remove leading/trailing slashes
    return normalizedPath.replace(/^\/+|\/+$/g, "");
}
