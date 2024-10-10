export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class LLMPrompt<T extends Record<string, string | number>, TResult> {
  private system: string;
  private messages: Message[];

  constructor(system: string, messages: Message[]) {
    this.system = system;
    this.messages = messages;
  }

  format(values: T): Message[] {
    return this.messages.map(message => ({
      ...message,
      content: LLMPrompt.formatString(message.content, values)
    }));
  }

  private static formatString(template: string, values: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (_, key) => values[key] !== undefined ? values[key].toString() : `{${key}}`);
  }

  getSystemMessage(): string {
    return this.system;
  }
}

interface GenerateTemplateLiteralRequest extends Record<string, string> {
  stepText: string;
  ingredient: string;
}

interface ExtractSkillsRequest extends Record<string, string> {
  step_text: string;
}

interface ExtractStepResourcesRequest extends Record<string, string> {
  recipe_text: string;
  step_text: string;
}

interface ExtractStepToolsRequest extends Record<string, string> {
  step_text: string;
}

interface GenerateTemplateLiteralResponse {
  value: string;
}

interface ExtractSkillsResponse {
  skills: [{ name: string }];
}

interface ExtractStepResourcesResponse {
  resources: [{ name: string, quantity: string, unit: string }];
}

interface ExtractStepToolsResponse {
  tools: [{ name: string }];
}


interface LLMPromptsInterface {
  generateTemplateLiteral: {
    default: LLMPrompt<GenerateTemplateLiteralRequest, GenerateTemplateLiteralResponse>;
  };
  extractStepSkills: {
    default: LLMPrompt<ExtractSkillsRequest, ExtractSkillsResponse>;
  };
  extractStepResources: {
    default: LLMPrompt<ExtractStepResourcesRequest, ExtractStepResourcesResponse>;
  },
  extractStepTools: {
    default: LLMPrompt<ExtractStepToolsRequest, ExtractStepToolsResponse>;
  }
}

export const LLMPrompts: LLMPromptsInterface = {
  generateTemplateLiteral: {
    default: new LLMPrompt<GenerateTemplateLiteralRequest, GenerateTemplateLiteralResponse>(
      `I am a high performing computer function that generate template literal from recipe step's text and ingredient data.`,
      [
        {
          role: 'user',
          content: `Generate template literal from this data:
          {step_text}
          {ingredient}.
          Generate response as the following format {template_literal: string]`
        }
      ]
    )
  },
  extractStepSkills: {
    default: new LLMPrompt<ExtractSkillsRequest, ExtractSkillsResponse>(
      `I am a high performing computer function that generate required skills from recipe step's text.`,
      [
        {
          role: 'user',
          content: `Generate required skills data from this recipe step's text: "Cook until the broccoli is crisp yet tender.."
          Generate JSON response as the following format { skills: [{name: string}]}`
        },
        {
          role: 'assistant',
          content: '{ skills: [{name: "Fry"}] }'
        },

        {
          role: 'user',
          content: `Generate required skills data from this recipe step's text: "Stir 2 tbsp heavy cream into the pot.."
          Generate JSON response as the following format { skills: [{name: string}]}`
        },
        {
          role: 'assistant',
          content: '{ skills: [{name: "Stir"}] }'
        },

        {
          role: 'user',
          content: `Generate required skills data from this recipe step's text: "Thinly slice 1 red onion.."
          Generate JSON response as the following format { skills: [{name: string}]}`
        },
        {
          role: 'assistant',
          content: '{ skills: [{name: "Slice"}] }'
        },

        {
          role: 'user',
          content: `Generate required skills data from this recipe step's text: "Put the pot on the stove.."
          Generate JSON response as the following format { skills: [{name: string}]}`
        },
        {
          role: 'assistant',
          content: '{ skills: [{name: "Transfer"}] }'
        },

        {
          role: 'user',
          content: `Generate required skills data from this recipe step's text: "After 18-20 minutes, remove the saucepan of rice from heat and let it sit, covered with a lid.."
          Generate JSON response as the following format { skills: [{name: string}]}`
        },
        {
          role: 'assistant',
          content: '{ skills: [{name: "Simmer"}] }'
        },

        {
          role: 'user',
          content: `Generate required skills data from this recipe step's text: "Sprinkle another third of the Cheddar cheese over the sauce.."
          Generate JSON response as the following format { skills: [{name: string}]}`
        },
        {
          role: 'assistant',
          content: '{ skills: [{name: "Sprinkle"}] }'
        },

        {
          role: 'user',
          content: `Generate required skills data from this recipe step's text: "Cut the sandwiches in half.."
          Generate JSON response as the following format { skills: [{name: string}]}`
        },
        {
          role: 'assistant',
          content: '{ skills: [{name: "cut"}] }'
        },

        {
          role: 'user',
          content: `Generate required skills data from this recipe step's text: "Preheat the oven to 350°F.."
          Generate JSON response as the following format { skills: [{name: string}]}`
        },
        {
          role: 'assistant',
          content: '{ skills: [{name: "Set temperature"}] }'
        },

        {
          role: 'user',
          content: `Generate required skills data from this recipe step's text: "Serve with maple syrup and berries.."
          Generate JSON response as the following format { skills: [{name: string}]}`
        },
        {
          role: 'assistant',
          content: '{ skills: [{name: "Serve"}] }'
        },

        {
          role: 'user',
          content: `Generate required skills data from this recipe step's text: "Mix the seasonings in the bowl.."
          Generate JSON response as the following format { skills: [{name: string}]}`
        },
        {
          role: 'assistant',
          content: '{ skills: [{name: "Mix"}] }'
        },
        {
          role: 'user',
          content: `Extract required skills data from this data: "{step_text}".
          Generate JSON response as the following format { skills: [{name: string}]}`
        }
      ]
    )
  },
  extractStepResources: {
    default: new LLMPrompt<ExtractSkillsRequest, ExtractSkillsResponse>(
      `I am a high performing computer function that extract ingredients from recipe step's text.`,
      [
        {
          role: 'user',
          content: `Heres the whole recipe test: "{recipe_text}".
          Extract ingredients data from this data: "{step_text}".
          Generate JSON response as the following format { resources: [{ name: string, quantity: string, unit: string }]}
          name is required field, quantity and unit are optional fields`
        }
      ]
    )
  },
  extractStepTools: {
    default: new LLMPrompt<ExtractSkillsRequest, ExtractSkillsResponse>(
      `I am a high performing computer function that extract tools from recipe step's text.`,
      [
        {
          role: 'user',
          content: `Extract tools data from this step: "{step_text}".
          Generate JSON response as the following format { tools: [{ name: string }]}`
        }
      ]
    )
  },
};

export default LLMPrompt