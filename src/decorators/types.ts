export type InputsMessagesCallableType<I, M, O> = (inputs: I, messages: M) => O;

export type ToolCallableType<I, O> = (inputs: I) => O;
