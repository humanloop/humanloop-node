#!/usr/bin/env node
import * as dotenv from "dotenv";
import { Command } from "commander";
import path from "path";

import { HumanloopClient } from "./humanloop.client";
import FileSyncer from "./sync/FileSyncer";
import { SDK_VERSION } from "./version";

dotenv.config();

const LogType = {
    SUCCESS: "\x1b[92m", // green
    ERROR: "\x1b[91m", // red
    INFO: "\x1b[96m", // cyan
    WARN: "\x1b[93m", // yellow
    RESET: "\x1b[0m",
} as const;

function log(message: string, type: keyof typeof LogType): void {
    console.log(`${LogType[type]}${message}${LogType.RESET}`);
}

const program = new Command();
program
    .name("humanloop")
    .description("Humanloop CLI for managing sync operations")
    .version(SDK_VERSION);

interface CommonOptions {
    apiKey?: string;
    envFile?: string;
    baseUrl?: string;
    localFilesDirectory?: string;
}

interface PullOptions extends CommonOptions {
    path?: string;
    environment?: string;
    verbose?: boolean;
    quiet?: boolean;
}

const addCommonOptions = (command: Command) =>
    command
        .option("--api-key <apiKey>", "Humanloop API key")
        .option("--env-file <envFile>", "Path to .env file")
        .option("--base-url <baseUrl>", "Base URL for Humanloop API")
        .option(
            "--local-dir, --local-files-directory <dir>",
            "Directory where Humanloop files are stored locally (default: humanloop/)",
            "humanloop",
        );

// Instantiate a HumanloopClient for the CLI
function getClient(options: CommonOptions): HumanloopClient {
    if (options.envFile) {
        const result = dotenv.config({ path: options.envFile });
        if (result.error) {
            log(
                `Failed to load environment file: ${options.envFile} (file not found or invalid format)`,
                "ERROR",
            );
            process.exit(1);
        }
    }

    const apiKey = options.apiKey || process.env.HUMANLOOP_API_KEY;
    if (!apiKey) {
        log(
            "No API key found. Set HUMANLOOP_API_KEY in .env file or environment, or use --api-key",
            "ERROR",
        );
        process.exit(1);
    }

    return new HumanloopClient({
        apiKey,
        baseUrl: options.baseUrl,
        localFilesDirectory: options.localFilesDirectory,
    });
}

// Helper to handle sync errors
function handleSyncErrors<T extends CommonOptions>(fn: (options: T) => Promise<void>) {
    return async (options: T) => {
        try {
            await fn(options);
        } catch (error) {
            log(`Error: ${error}`, "ERROR");
            process.exit(1);
        }
    };
}

// Pull command
addCommonOptions(
    program
        .command("pull")
        .description(
            "Pull Prompt and Agent files from Humanloop to your local filesystem.\n\n" +
                "This command will:\n" +
                "1. Fetch Prompt and Agent files from your Humanloop workspace\n" +
                "2. Save them to your local filesystem (directory specified by --local-files-directory, default: humanloop/)\n" +
                "3. Maintain the same directory structure as in Humanloop\n" +
                "4. Add appropriate file extensions (.prompt or .agent)\n\n" +
                "For example, with the default --local-files-directory=humanloop, files will be saved as:\n" +
                "./humanloop/\n" +
                "├── my_project/\n" +
                "│   ├── prompts/\n" +
                "│   │   ├── my_prompt.prompt\n" +
                "│   │   └── nested/\n" +
                "│   │       └── another_prompt.prompt\n" +
                "│   └── agents/\n" +
                "│       └── my_agent.agent\n" +
                "└── another_project/\n" +
                "    └── prompts/\n" +
                "        └── other_prompt.prompt\n\n" +
                "If you specify --local-files-directory=data/humanloop, files will be saved in ./data/humanloop/ instead.\n\n" +
                "If a file exists both locally and in the Humanloop workspace, the local file will be overwritten\n" +
                "with the version from Humanloop. Files that only exist locally will not be affected.\n\n" +
                "Currently only supports syncing Prompt and Agent files. Other file types will be skipped.",
        )
        .option(
            "-p, --path <path>",
            "Path in the Humanloop workspace to pull from (file or directory). " +
                "You can pull an entire directory (e.g. 'my/directory') or a specific file (e.g. 'my/directory/my_prompt.prompt'). " +
                "When pulling a directory, all files within that directory and its subdirectories will be included. " +
                "Paths should not contain leading or trailing slashes. " +
                "If not specified, pulls from the root of the remote workspace.",
        )
        .option(
            "-e, --environment <env>",
            "Environment to pull from (e.g. 'production', 'staging')",
        )
        .option("-v, --verbose", "Show detailed information about the operation")
        .option("-q, --quiet", "Suppress output of successful files"),
).action(
    handleSyncErrors(async (options: PullOptions) => {
        const client = getClient(options);

        // Create a separate FileSyncer instance with log level based on verbose flag only
        const fileSyncer = new FileSyncer(client, {
            baseDir: options.localFilesDirectory,
            verbose: options.verbose,
        });

        log("Pulling files from Humanloop...", "INFO");
        log(`Path: ${options.path || "(root)"}`, "INFO");
        log(`Environment: ${options.environment || "(default)"}`, "INFO");

        const startTime = Date.now();
        const [successfulFiles, failedFiles] = await fileSyncer.pull(
            options.path,
            options.environment,
        );
        const duration = Date.now() - startTime;

        // Always show operation result
        const isSuccessful = failedFiles.length === 0;
        log(`Pull completed in ${duration}ms`, isSuccessful ? "SUCCESS" : "ERROR");

        // Only suppress successful files output if quiet flag is set
        if (successfulFiles.length > 0 && !options.quiet) {
            console.log(); // Empty line
            log(`Successfully pulled ${successfulFiles.length} files:`, "SUCCESS");
            for (const file of successfulFiles) {
                log(`  ✓ ${file}`, "SUCCESS");
            }
        }

        // Always show failed files
        if (failedFiles.length > 0) {
            console.log(); // Empty line
            log(`Failed to pull ${failedFiles.length} files:`, "ERROR");
            for (const file of failedFiles) {
                log(`  ✗ ${file}`, "ERROR");
            }
        }
    }),
);

program.parse(process.argv);
