/** @type {import('jest').Config} */
export default {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
        "^(?!.*node_modules)(.+)\\.js$": "$1",
    },
};
