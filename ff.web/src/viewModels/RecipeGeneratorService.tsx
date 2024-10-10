import { Resource } from "@vuo/models/Resource";
import { RecipeTool } from "@vuo/models/Step";
import LLMPrompt, { LLMPrompts } from "./LLMPrompt";

interface StepResponse {
  downtime?: number;
  resources?: Resource[];
  text: string;
  tools?: RecipeTool[];
};

export default class RecipeGeneratorService {
  static apiUrl = process.env.OPEN_AI_API_URL
  static apiKey = process.env.OPEN_AI_API_KEY

  private static async fetchFromAPI(prompt: LLMPrompt, values: { [key: string]: string }) {
    const messages = [
      { role: 'system', content: prompt.getSystemMessage() },
      ...prompt.format(values)
    ]

    const response = await fetch(RecipeGeneratorService.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RecipeGeneratorService.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.2,
        response_format: { "type": "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch response from ChatGPT');
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    return JSON.parse(generatedText);
  }

  static async atomizeStep(stepText: string, previousStepsTexts: string = ''): Promise<{ steps: StepResponse[] }> {
    const prompt = LLMPrompts.atomizeStep.default;
    return this.fetchFromAPI(prompt, { stepText, previousStepsTexts });
  }

  static async extractNameAndDescription(recipeText: string): Promise<{ name: string; description: string }> {
    const prompt = LLMPrompts.extractNameAndDescription.default;
    const json = await this.fetchFromAPI(prompt, { recipeText });
    return { name: json.name, description: json.description };
  }

  static async extractSteps(recipeText: string): Promise<{ steps: StepResponse[] }> {
    const prompt = LLMPrompts.extractSteps.withoutIngredients;
    return this.fetchFromAPI(prompt, { recipeText });
  }

  static async generateDescription(recipeDescription: string): Promise<{ value: string }> {
    const prompt = LLMPrompts.generateDescription.default;
    return this.fetchFromAPI(prompt, { recipeDescription });
  }

  static async generateName(recipeName: string): Promise<{ value: string }> {
    const prompt = LLMPrompts.generateName.dark;
    return this.fetchFromAPI(prompt, { recipeName });
  }

  static async extractResources(recipeText: string): Promise<Resource[]> {
    const prompt = LLMPrompts.extractResources.default;
    return this.fetchFromAPI(prompt, { recipeText });
  }

  static async simplifyRecipe(recipeText: string): Promise<{ value: string }> {
    const prompt = LLMPrompts.simplifyRecipe.default;
    return this.fetchFromAPI(prompt, { recipeText });
  }
}