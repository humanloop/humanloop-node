/**
 * Maps arguments to their corresponding parameter names in the function signature.
 *
 * Example:
 * ```typescript
 * function foo(a: number, b: number = 2, c: number = 3): void {}
 *
 * argsToInputs(foo, [1, 2], {}) // { a: 1, b: 2, c: 3 }
 * argsToInputs(foo, [1], { b: 8 }) // { a: 1, b: 8, c: 3 }
 * argsToInputs(foo, [1], {}) // { a: 1, b: 2, c: 3 }
 * ```
 *
 * @param func - The target function
 * @param args - Positional arguments passed to the function
 * @returns An object mapping argument names to their values
 */
export function argsToInputs(func: Function, args: any[]): Record<string, any> {
    const paramNames = computeOriginalArguments(func) || [];

    // Map positional arguments to parameter names
    const inputs: Record<string, any> = {};
    paramNames.forEach((name, index) => {
        if (index < args.length) {
            inputs[name] = args[index];
        }
    });

    return inputs;
}

function computeOriginalArguments(originalFunc: Function): null | string[] {
    const stringified: string = originalFunc.toString();
    const startBracket = stringified.indexOf("(");
    if (startBracket < 0) {
        return null;
    }
    const endBracket = stringified.indexOf(")", startBracket);
    if (endBracket < 0) {
        return null;
    }
    const paramsString = stringified.substring(startBracket + 1, endBracket);
    if (paramsString.length === 0) {
        return [];
    }
    const params = paramsString.split(",").map((e) => e.trim());
    return params;
}
