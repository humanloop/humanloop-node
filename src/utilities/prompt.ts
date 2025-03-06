import * as contextApi from "@opentelemetry/api";

import { setDecoratorContext, setPromptContext } from "../eval_utils";

export function promptDecoratorFactory<I, O>(path: string, callable: (inputs: I) => O) {
    const fileType = "prompt";

    const wrappedFunction = (inputs: I) => {
        return contextApi.context.with(
            setDecoratorContext({
                filePath: path,
                type: fileType,
            }),
            async () => {
                contextApi.context.with(
                    setPromptContext({
                        path: path,
                    }),
                    async () => {
                        return await callable(inputs);
                    },
                );
            },
        );
    };

    return Object.assign(wrappedFunction, {
        decorator: {
            path: path,
            type: fileType,
        },
    });
}
