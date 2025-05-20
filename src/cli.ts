#!/usr/bin/env node
import * as dotenv from "dotenv";
import { Command } from "commander";

import { HumanloopClient } from "./humanloop.client";
import Logger from "./utils/Logger";

const { version } = require("../package.json");

// Load environment variables
dotenv.config();

const program = new Command();
program
    .name("humanloop")
    .description("Humanloop CLI for managing sync operations")
    .version(version);

// Common auth options
const addAuthOptions = (command: Command) =>
    command
        .option("--api-key <apiKey>", "Humanloop API key")
        .option("--env-file <envFile>", "Path to .env file")
        .option("--base-url <baseUrl>", "Base URL for Humanloop API");

// Helper to get client
function getClient(options: {
    envFile?: string;
    apiKey?: string;
    baseUrl?: string;
    baseDir?: string;
}): HumanloopClient {
    if (options.envFile) dotenv.config({ path: options.envFile });
    const apiKey = options.apiKey || process.env.HUMANLOOP_API_KEY;
    if (!apiKey) {
        Logger.error(
            "No API key found. Set HUMANLOOP_API_KEY in .env file or use --api-key",
        );
        process.exit(1);
    }
    return new HumanloopClient({
        apiKey,
        baseUrl: options.baseUrl,
        sync: { baseDir: options.baseDir },
    });
}

// Pull command
addAuthOptions(
    program
        .command("pull")
        .description("Pull files from Humanloop to local filesystem")
        .option("-p, --path <path>", "Path to pull (file or directory)")
        .option("-e, --environment <env>", "Environment to pull from")
        .option("--base-dir <baseDir>", "Base directory for synced files", "humanloop"),
).action(async (options) => {
    Logger.info("Pulling files from Humanloop...");
    // try {
    //     Logger.info("Pulling files from Humanloop...");
    //     const client = getClient(options);
    //     const files = await client.pull(options.path, options.environment);
    //     Logger.success(`Successfully synced ${files.length} files`);
    // } catch (error) {
    //     Logger.error(`Error: ${error}`);
    //     process.exit(1);
    // }
});

program.parse(process.argv);
