import { HL_CONTEXT, setDecoratorContext } from "../context";

export function promptDecoratorFactory<I, O>(path: string, callable: (inputs: I) => O) {
    const fileType = "prompt";

    const wrappedFunction = (inputs: I) => {
        return HL_CONTEXT.with(
            setDecoratorContext({
                path: path,
                type: fileType,
                version: {
                    // TODO: Implement reverse lookup of template
                    template: undefined,
                },
            }),
            async () => {
                return await callable(inputs);
            },
        );
    };

    return Object.assign(wrappedFunction, {
        file: {
            path: path,
            type: fileType,
            version: {
                // TODO: Implement reverse lookup of template
                template: undefined,
            },
            callable: wrappedFunction,
        },
    });
}
