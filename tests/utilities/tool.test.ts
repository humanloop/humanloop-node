import { toolUtilityFactory } from "../../src/utilities/tool";
import { Validator } from "jsonschema";
import {
    HUMANLOOP_FILE_KEY,
    HUMANLOOP_FILE_TYPE_KEY,
    HUMANLOOP_LOG_KEY,
    readFromOpenTelemetrySpan,
} from "../../src/otel";
import { openTelemetryTestConfiguration } from "./fixtures";
import { Schema } from "ts-json-schema-generator";

/**
 * Perform arithmetic operations on two numbers.
 *
 * @param operation - The arithmetic operation to perform ("add", "subtract", "multiply", "divide").
 * @param num1 - The first number.
 * @param num2 - The second number.
 * @returns The result of the arithmetic operation.
 * @throws Error if the operation is invalid.
 */
function calculator(operation: string, num1: number, num2: number): number {
    switch (operation) {
        case "add":
            return num1 + num2;
        case "subtract":
            return num1 - num2;
        case "multiply":
            return num1 * num2;
        case "divide":
            if (num2 === 0) {
                throw new Error("Division by zero is not allowed.");
            }
            return num1 / num2;
        default:
            throw new Error(`Invalid operation: ${operation}`);
    }
}

describe("tool decorator", () => {
    it("should return 3 when adding 1 and 2", async () => {
        const [tracer, exporter] = openTelemetryTestConfiguration();

        const calculatorDecorated = toolUtilityFactory(
            tracer,
            calculator,
            {
                function: {
                    name: "calculator",
                    description: "Perform arithmetic operations on two numbers.",
                    strict: true,
                    parameters: {
                        operation: "string",
                        num1: "number",
                        num2: "number",
                    },
                },
            },
            "Calculator"
        );
        const result = await calculatorDecorated("add", 1, 2);
        expect(result).toBe(3);
        expect(exporter.getFinishedSpans().length).toBe(1);
        const span = exporter.getFinishedSpans()[0];
        const hlFile = readFromOpenTelemetrySpan(span, HUMANLOOP_FILE_KEY);
        expect(hlFile).toStrictEqual({
            path: "Calculator",
            type: "tool",
        });
        const type = readFromOpenTelemetrySpan(span, HUMANLOOP_FILE_TYPE_KEY);
        expect(type).toBe("tool");
        const log = readFromOpenTelemetrySpan(span, HUMANLOOP_LOG_KEY);
        expect(log.inputs).toStrictEqual({
            operation: "add",
            num1: 1,
            num2: 2,
        });
        expect(log.output).toBe("3");
        expect(calculatorDecorated.jsonSchema).toStrictEqual({
            name: "calculator",
            description: "Perform arithmetic operations on two numbers.",
            parameters: {
                operation: "string",
                num1: "number",
                num2: "number",
            },
            strict: true,
        });
        // @ts-ignore
        new Validator().validate(log, calculatorDecorated.jsonSchema);
    });

    it("should support functions that return void", async () => {
        const [tracer, exporter] = openTelemetryTestConfiguration();

        const decorated = toolUtilityFactory(
            tracer,
            () => {},
            {
                function: {
                    name: "Hello World",
                    description: "Dummy function that does nothing.",
                },
            },
            "Calculator"
        );
        const result = await decorated();
        expect(result).toBe(undefined);
        expect(exporter.getFinishedSpans().length).toBe(1);
    });
});
