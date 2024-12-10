import { ReadableSpan } from "@opentelemetry/sdk-trace-base";
import { SpanKind } from "@opentelemetry/api";
import { AttributeValue } from "@opentelemetry/api";
import { v4 as uuidv4 } from "uuid";

// Constants for Humanloop attributes
import { HUMANLOOP_FILE_TYPE_KEY } from "./constants";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { OpenAIInstrumentation } from "@traceloop/instrumentation-openai";
import { AnthropicInstrumentation } from "@traceloop/instrumentation-anthropic";
import { CohereInstrumentation } from "@traceloop/instrumentation-cohere";

export type NestedDict = { [key: string]: NestedDict | AttributeValue };
export type NestedList = Array<NestedDict | AttributeValue>;

/**
 * Transforms a list of values into a dictionary with index values as keys.
 * Nested lists are linearized into dictionaries.
 *
 * @param lst - List of nested values to transform
 * @returns Dictionary representation of the list
 */
function _listToOtelFormat(lst: NestedList): NestedDict {
    return lst.reduce<NestedDict>((acc, val, idx) => {
        acc[idx.toString()] = Array.isArray(val) ? _listToOtelFormat(val as (NestedDict | AttributeValue)[]) : val;
        return acc;
    }, {});
}

/**
 * Writes a Python-like object to the OpenTelemetry Span's attributes.
 * Converts complex objects into a linearized dictionary representation.
 *
 * @param span - OpenTelemetry span to write values to
 * @param value - Object to write to the span attributes
 * @param key - Key prefix for the span attributes
 */
export function writeToOpenTelemetrySpan(
    span: ReadableSpan,
    value: NestedDict | NestedList | AttributeValue,
    key: string
): void {
    let toWriteCopy: NestedDict;

    if (Array.isArray(value)) {
        // @ts-ignore
        toWriteCopy = _listToOtelFormat(value);
    } else {
        // @ts-ignore
        toWriteCopy = { ...value } as NestedDict;
    }

    const linearisedAttributes: Record<string, AttributeValue> = {};
    const workStack: Array<[string, NestedDict | AttributeValue]> = [[key, toWriteCopy]];

    // Remove existing attributes with the same prefix
    Object.keys(span.attributes || {}).forEach((attributeKey) => {
        if (attributeKey.startsWith(key)) {
            delete (span.attributes as any)[attributeKey];
        }
    });

    while (workStack.length > 0) {
        const [currentKey, currentValue] = workStack.pop()!;

        if (currentValue === null) {
            continue;
        }

        if (typeof currentValue === "object" && !Array.isArray(currentValue)) {
            Object.entries(currentValue).forEach(([subKey, subValue]) => {
                workStack.push([currentKey ? `${currentKey}.${subKey}` : subKey, subValue]);
            });
        } else {
            linearisedAttributes[currentKey] = currentValue as AttributeValue;
        }
    }

    Object.entries(linearisedAttributes).forEach(([finalKey, finalValue]) => {
        if (finalValue !== null) {
            (span.attributes as any)[finalKey] = finalValue;
        }
    });
}

/**
 * Reads a value from the OpenTelemetry span attributes.
 * Reconstructs the original object structure from a key prefix.
 *
 * @param span - OpenTelemetry span to read values from
 * @param key - Key prefix to read from the span attributes
 * @returns Reconstructed object from the span attributes
 */
export function readFromOpenTelemetrySpan(span: ReadableSpan, key: string = ""): NestedDict {
    if (!span.attributes) {
        throw new Error("Span attributes are empty");
    }

    let result: NestedDict = {};

    const toProcess: Array<[string, AttributeValue?]> = [];
    Object.entries(span.attributes).forEach(([spanKey, spanValue]) => {
        if (key === "" || spanKey.startsWith(key)) {
            const newKey = key === "" ? spanKey : spanKey.slice(key.length + 1);
            toProcess.push([newKey, spanValue]);
        }
    });

    if (toProcess.length === 0) {
        if (key === "") {
            return result;
        }
        throw new Error(`Key ${key} not found in span attributes`);
    }

    toProcess.forEach(([spanKey, spanValue]) => {
        const parts = spanKey.split(".");
        let currentLevel: NestedDict = result;

        parts.forEach((part, idx) => {
            if (idx === parts.length - 1) {
                currentLevel[part] = spanValue!;
            } else {
                if (!(part in currentLevel)) {
                    currentLevel[part] = {};
                }
                currentLevel = currentLevel[part] as NestedDict;
            }
        });
    });

    const pseudoToList = (subDict: NestedDict): NestedList | NestedDict => {
        if (typeof subDict !== "object" || Array.isArray(subDict)) {
            return subDict;
        }

        Object.keys(subDict).forEach((key) => {
            // @ts-ignore
            subDict[key] = pseudoToList(subDict[key] as NestedDict);
        });

        if (Object.keys(subDict).every((key) => /^\d+$/.test(key))) {
            return Object.values(subDict);
        }

        return subDict;
    };

    result = pseudoToList(result) as NestedDict;
    if ("" in result) {
        // User read the root of attributes
        return result[""] as NestedDict;
    }

    return result;
}

/**
 * Determines if the span was created by an instrumentor for LLM provider clients.
 *
 * @param span - OpenTelemetry span to check
 * @returns True if the span corresponds to an LLM provider call, false otherwise
 */
export function isLLMProviderCall(span: ReadableSpan): boolean {
    if (!span.instrumentationLibrary) return false;

    const spanInstrumentor = span.instrumentationLibrary.name;
    const instrumentorPrefixes = [
        "@traceloop/instrumentation-openai",
        "@traceloop/instrumentation-anthropic",
        "@traceloop/instrumentation-cohere",
    ];

    return (
        span.kind === SpanKind.CLIENT &&
        instrumentorPrefixes.some((instrumentLibrary) => spanInstrumentor === instrumentLibrary)
    );
}

/**
 * Checks if the span was created by the Humanloop SDK.
 *
 * @param span - OpenTelemetry span to check
 * @returns True if the span was created by the Humanloop SDK, false otherwise
 */
export function isHumanloopSpan(span: ReadableSpan): boolean {
    return span.attributes[HUMANLOOP_FILE_TYPE_KEY] !== undefined;
}

/**
 * Determines if the current Node.js environment has a specific module installed.
 *
 * @param moduleName - Name of the module to check
 * @returns True if the module is installed, false otherwise
 */
export function moduleIsInstalled(moduleName: string): boolean {
    try {
        require.resolve(moduleName);
        return true;
    } catch {
        return false;
    }
}

/**
 * Generates a unique span ID.
 *
 * @returns A UUID string
 */
export function generateSpanId(): string {
    return uuidv4();
}

/**
 * Converts the output to JSON if it's not already a string.
 * Throws an error if the output is not JSON serializable.
 *
 * @param func - Function whose output is being converted
 * @param output - Output to be converted
 * @returns JSON string representation of the output
 */
export function jsonifyIfNotString(func: Function, output: any): string {
    if (typeof output !== "string") {
        try {
            return JSON.stringify(output);
        } catch (error) {
            throw new TypeError(`Output of ${func.name} must be a string or JSON serializable`);
        }
    }
    return output;
}
