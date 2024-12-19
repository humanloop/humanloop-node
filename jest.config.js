/** @type {import('jest').Config} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    // If Jest complains about an unknown symbol when running tests, you're dealing with dependency
    // written in ES module instead of CJS format. Add the dependency in the exclusive regex group below.
    // All modules NOT matching the pattern (thus exclusive grouping) will be passed to babel for
    // transpilation before tests are ran.
    transformIgnorePatterns: ["<rootDir>/node_modules/(?!p-map/)"],
    transform: {
        "\\.js$": "babel-jest"
    }
};
