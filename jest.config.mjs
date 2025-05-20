/** @type {import('jest').Config} */
export default {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
        // Only map .js files in our src directory, not node_modules
        "^src/(.+)\\.js$": "<rootDir>/src/$1",
    },
    // Add transformIgnorePatterns to handle ESM modules in node_modules
    transformIgnorePatterns: [
        "node_modules/(?!(@traceloop|js-tiktoken|base64-js)/)",
    ],
};
