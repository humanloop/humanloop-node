import * as contextApi from "@opentelemetry/api";
import { setPromptContext } from "eval_utils";

export function promptDecoratorFactory<I, O>(
    path: string,
    callable: (inputs: I) => O,
    template?: string,
) {
    const wrappedFunction = (inputs: I) => {
        return contextApi.context.with(
            setPromptContext({
                path: path,
                template: template,
            }),
            async () => {
                return await callable(inputs);
            },
        );
    };

    return wrappedFunction;
}
