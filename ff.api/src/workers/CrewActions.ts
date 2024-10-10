import { IStep } from "../models/stepModel";

export class CrewAction<TParams extends Record<string, string | number>, TResult> {

  static apiUrl = process.env.VITE_CREW_API_URL;

  constructor(
    private url: string,
    private method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
  ) { }

  async executeRequest(params?: Partial<TParams>): Promise<TResult> {
    const url = `${CrewAction.apiUrl}${this.url}`;
    try {
      console.log('calling ff.crew with params', params)

      const response = await fetch(url, {
        method: this.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: params ? JSON.stringify(params) : undefined,
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const responseAsJSON = await response.json();

      console.log('received response from ff.crew', responseAsJSON)

      return responseAsJSON as TResult;
    } catch (error) {
      console.log('failures', (error as Error).message)
      throw error;
    }
  }
}

export class CrewActions {
  static simplifyRecipe(): CrewAction<
    { recipe_text: string },
    { result: { validated_text: string } }
  > {
    return new CrewAction('/recipes/simplify', 'POST');
  }

  static extractNameAndDescription(): CrewAction<
    { recipe_text: string },
    { result: { description: string, name: string } }
  > {
    return new CrewAction('/recipes/extract-data', 'POST');
  }

  static extractSteps(): CrewAction<
    { recipe_text: string },
    { result: { steps: IStep[] } }
  > {
    return new CrewAction('/recipes/extract-steps', 'POST');
  }

  static atomizeStep(): CrewAction<
    { current_step: string, previous_steps: string },
    { result: { steps: IStep[] } }
  > {
    return new CrewAction('/recipes/atomize', 'POST');
  }

  static generateStepImage(): CrewAction<
    { recipe_step: string },
    { image_url: string }
  > {
    return new CrewAction('/images/generate', 'POST');
  }
}

export default CrewActions