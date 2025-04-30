import { LanguageModelV1FinishReason } from '@ai-sdk/provider';

// TODO see what provider finish reasons are and map
export function mapHumanloopFinishReason(
  finishReason: string | null | undefined,
): LanguageModelV1FinishReason {
  switch (finishReason) {
    case 'stop':
      return 'stop';
    case 'length':
    case 'model_length':
      return 'length';
    case 'tool_calls':
      return 'tool-calls';
    case 'content-filter':
      return 'content-filter';
    default:
      return 'unknown';
  }
}