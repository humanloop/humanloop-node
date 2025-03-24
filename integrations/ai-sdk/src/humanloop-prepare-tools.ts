import {
  LanguageModelV1CallWarning,
  LanguageModelV1FunctionTool,
  LanguageModelV1ProviderDefinedTool,
  LanguageModelV1ToolChoice,
  UnsupportedFunctionalityError
} from '@ai-sdk/provider';
import { HumanloopToolChoice, HumanloopTools } from './humanloop-api-types';
  
  export function prepareTools({
    tools,
    toolChoice = { type: 'auto' },
  }: {
    tools?: Array<LanguageModelV1FunctionTool | LanguageModelV1ProviderDefinedTool>,
    toolChoice: LanguageModelV1ToolChoice,
  }
  ): {
    tools: HumanloopTools | undefined
    toolChoice: HumanloopToolChoice | undefined
    toolWarnings: LanguageModelV1CallWarning[];
  } {
    // when the tools array is empty, change it to undefined to prevent errors:
    const toolWarnings: LanguageModelV1CallWarning[] = [];

    if (!tools || !tools.length) {
      return { tools: undefined, toolChoice: undefined, toolWarnings };
    }
  
    const humanloopTools: HumanloopTools = [];
  
    for (const tool of tools) {
      if (tool.type === 'provider-defined') {
        toolWarnings.push({ type: 'unsupported-tool', tool });
      } else {
        humanloopTools.push({
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters as Record<string, any>,
        });
      }
    }
    
    if (toolChoice == null) {
      return { tools: humanloopTools, toolChoice: undefined, toolWarnings };
    }
  
    const type = toolChoice.type;
  
    switch (type) {
      case 'auto':
      case 'none':
      case 'required':
        return { tools: humanloopTools, toolChoice: type, toolWarnings };
  
      case 'tool':
        return {
          tools: humanloopTools,
          toolChoice: {
            type: 'function',
            function: { name: toolChoice.toolName }
          },
          toolWarnings,
        }
      default: {
        const _exhaustiveCheck: never = type;
        throw new UnsupportedFunctionalityError({
          functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`,
        });
      }
    }
  }