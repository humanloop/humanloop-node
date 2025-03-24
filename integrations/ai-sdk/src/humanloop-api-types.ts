import {
    ChatMessage,
    PromptsCallRequest,
    PromptsCallStreamRequest,
    ProviderApiKeys
} from "../../../src/api";

export type HumanloopProviderApiKeys = ProviderApiKeys
export type HumanloopChatPrompt = Array<ChatMessage>;
export type HumanloopGenerateArgs = PromptsCallRequest | PromptsCallStreamRequest;
export type HumanloopTools =
    | PromptsCallRequest["prompt"]["tools"]
    | PromptsCallStreamRequest["prompt"]["tools"];
export type HumanloopToolChoice =
    | PromptsCallRequest["toolChoice"]
    | PromptsCallStreamRequest["toolChoice"];