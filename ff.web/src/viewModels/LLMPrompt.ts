export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class LLMPrompt {
  private system: string;
  private messages: Message[];

  constructor(system: string, messages: Message[]) {
    this.system = system;
    this.messages = messages;
  }

  format(values: { [key: string]: string | number }): Message[] {
    return this.messages.map(message => ({
      ...message,
      content: LLMPrompt.formatString(message.content, values)
    }));
  }

  private static formatString(template: string, values: { [key: string]: string | number }): string {
    return template.replace(/\{(\w+)\}/g, (_, key) => values[key] !== undefined ? values[key].toString() : `{${key}}`);
  }

  getSystemMessage(): string {
    return this.system;
  }
}

interface LLMPromptsInterface {
  atomizeStep: {
    default: LLMPrompt;
    withExamples: LLMPrompt;
  };
  extractNameAndDescription: {
    default: LLMPrompt;
  };
  extractSteps: {
    default: LLMPrompt;
    withoutIngredients: LLMPrompt;
  };
  generateDescription: {
    default: LLMPrompt;
  };
  generateName: {
    default: LLMPrompt;
    dark: LLMPrompt;
  };
  extractResources: {
    default: LLMPrompt;
  };
  extractResourcesFromStep: {
    default: LLMPrompt;
  },
  simplifyRecipe: {
    default: LLMPrompt;
  };
}
// All the actual prompts live here
// To add new prompt:
// 1. copy the default object and paste inside the same root name
// 2. change the key name from default to something else (e.g., funnyNamePrompt)
// 3. rewrite the first text which is system message
// 4. rewrite the list of messages which are user or assistant messages
/* for example to create new generateDescription prompt
generateDescription: {
  default:
    new LLMPrompt(
      'You are a helpful assistant that generates new recipe descriptions.',
      [
        { role: 'user', content: 'Generate a new description from this recipe description: {recipeDescription}. Respond with the following JSON format {value: string}' }
      ]
    )
}

generateDescription: {
  default:
    new LLMPrompt(
      'You are a helpful assistant that generates new recipe descriptions.',
      [
        { role: 'user', content: 'Generate a new description from this recipe description: {recipeDescription}. Respond with the following JSON format {value: string}' }
      ]
    ),
  FunnyNamePrompt:
    new LLMPrompt(
      'You are a helpful assistant that generates funny new recipe descriptions.',
      [
        { role: 'user', content: 'Generate a new funny description from this recipe description: {recipeDescription}. Respond with the following JSON format {value: string}' }
      ]
    )
},
*/
// 5. open the RecipeGeneratorService file
// 6. locate where this generateDescription prompts are used
// 7. change the code so that it won't call default but the new prompt
// const prompt = LLMPrompts.generateDescription.default; -> const prompt = LLMPrompts.generateDescription.FunnyNamePrompt;
// 8. now the new prompt is in use!
export const LLMPrompts: LLMPromptsInterface = {
  // These are the prompts to atomize one step from recipe
  atomizeStep: {
    default: new LLMPrompt(
      `You are a helpful assistant that atomizes recipe steps into smaller steps.
      Always break down recipes into the simplest steps possible.
      Ensure each step is clear and easy to understand.
      Focus on creating isolated action steps for each part of the recipe.`,
      [
        { role: 'user', content: 'Atomize the following step text: {stepText}. Previous steps processed: {previousStepsTexts}. Generate JSON in the following format: [{text: string}]' }
      ]
    ),
    withExamples: new LLMPrompt(
      `You are a helpful assistant that atomizes recipe steps into smaller steps.
      Always break down recipes into the simplest steps possible.
      Ensure each step is clear and easy to understand.
      Focus on creating isolated action steps for each part of the recipe.`,
      [
        {
          role: 'user', content: `
          Atomize the following step text: Line a pie plate or any ovenproof dish with parchment paper. Pour the crust mixture into the dish and spread it evenly with a spatula. Bake for 15 minutes, until the crust is golden.
          Previous steps processed: Crack eggs into a bowl.	Add shredded mozzarella cheese to the bowl.	Add cream cheese to the bowl.	Add salt to the bowl.	Add garlic powder to the bowl.	Mix all ingredients in the bowl until combined.
          Generate JSON in the following format: [{text: string}]` },
        {
          role: 'assistant', content: `[{text: "Line a pie plate with parchment paper.", {text: "Pour the mixture into the pie plate."}, {text: "Bake for 15 minutes until golden."}, {text: "Remove the pie plate from the oven."}}]`
        },
        { role: 'user', content: 'Atomize the following step text: {stepText}. Previous steps processed: {previousStepsTexts}. Generate JSON in the following format: [{text: string}]' }
      ]
    )
  },
  // These are the prompts to extract name and description from recipe
  extractNameAndDescription: {
    default:
      new LLMPrompt(
        `Act as a culinary assistant focused on extracting data from cooking recipes.
      Do not alter, modify or edit the extracted text. Response have to be in JSON format.`,
        [
          { role: 'user', content: 'Extract the name and description from this recipe: {recipeText}. Generate response as the following format {name: string, description: string}' }
        ]
      )
  },
  // These are the prompts to extract steps from recipe
  extractSteps: {
    default:
      new LLMPrompt(
        'You are a helpful assistant that extracts recipe steps from recipe text data.',
        [
          {
            role: 'user', content: `Extract step texts used in this recipe:
                      "Ingredients
                      Crust
                      4 eggs
                      1¼ cups (5 oz.) shredded mozzarella cheese
                      2 oz. (4 tbsp) cream cheese
                      ¼ tsp salt
                      1 tsp garlic powder
                      Topping
                      3 tbsp tomato sauce
                      1½ cups (6 oz.) shredded mozzarella cheese
                      2 tsp dried oregano
                      Instructions
                      Preheat the oven to 400°F (200°C).
                      Start by making the crust. Crack eggs into a medium-sized bowl and add the rest of the crust ingredients. Give it a good stir to combine.
                      Line a pie plate (a normal sized pie plate is big enough for two portions), or any other ovenproof dish, with parchment paper (crumple the sheet before you flatten it out to make it stay down more easily). Pour in the pizza crust batter. Spread it out evenly with a spatula. Bake for 15 minutes until the pizza crust turns golden.
                      Use a spatula to spread tomato sauce over the crust. Top with cheese.
                      Bake for another 10 minutes or until the pizza has turned a golden brown color.
                      Sprinkle with oregano and serve."
            Generate JSON as the following format {steps: [{text: string}]}` },
          {
            role: 'assistant', content: `
            [{text: "Preheat the oven to 400°F (200°C)."},
            {text: "Start by making the crust. Crack eggs into a medium-sized bowl and add the rest of the crust ingredients. Give it a good stir to combine."},
            {text: "Line a pie plate (a normal sized pie plate is big enough for two portions), or any other ovenproof dish, with parchment paper (crumple the sheet before you flatten it out to make it stay down more easily). Pour in the pizza crust batter. Spread it out evenly with a spatula. Bake for 15 minutes until the pizza crust turns golden."},
            {text: "Use a spatula to spread tomato sauce over the crust. Top with cheese."},
            {text: "Bake for another 10 minutes or until the pizza has turned a golden brown color."},
            {text: "Sprinkle with oregano and serve."}]` },
          { role: 'user', content: 'Extract step texts used in this recipe: {recipeText}. Generate JSON as the following format {steps: [{text: string}]}' }
        ]
      ),
    withoutIngredients:
      new LLMPrompt(
        'You are a helpful assistant that extracts recipe steps from recipe text data. Do not add the the ingredient quantities or units to the steps.',
        [
          {
            role: 'user', content: `Extract step texts used in this recipe:
                      "Ingredients
                      Crust
                      4 eggs
                      1¼ cups (5 oz.) shredded mozzarella cheese
                      2 oz. (4 tbsp) cream cheese
                      ¼ tsp salt
                      1 tsp garlic powder
                      Topping
                      3 tbsp tomato sauce
                      1½ cups (6 oz.) shredded mozzarella cheese
                      2 tsp dried oregano
                      Instructions
                      Preheat the oven to 400°F (200°C).
                      Start by making the crust. Crack 4 eggs into a medium-sized bowl and add the rest of the crust ingredients. Give it a good stir to combine.
                      Line a pie plate (a normal sized pie plate is big enough for two portions), or any other ovenproof dish, with parchment paper (crumple the sheet before you flatten it out to make it stay down more easily).
                      Pour in the pizza crust batter. Spread it out evenly with a spatula. Bake for 15 minutes until the pizza crust turns golden.
                      Use a spatula to spread 3 tbsp of tomato sauce over the crust. Top with 2 oz of cheese.
                      Bake for another 10 minutes or until the pizza has turned a golden brown color.
                      Sprinkle with 2 tsp of oregano and serve."
            Generate JSON as the following format {steps: [{text: string}]}` },
          {
            role: 'assistant', content: `
            [{text: "Preheat the oven to 400°F (200°C)."},
            {text: "Start by making the crust. Crack eggs into a medium-sized bowl and add the rest of the crust ingredients. Give it a good stir to combine."},
            {text: "Line a pie plate (a normal sized pie plate is big enough for two portions), or any other ovenproof dish, with parchment paper (crumple the sheet before you flatten it out to make it stay down more easily). Pour in the pizza crust batter. Spread it out evenly with a spatula. Bake for 15 minutes until the pizza crust turns golden."},
            {text: "Use a spatula to spread tomato sauce over the crust. Top with cheese."},
            {text: "Bake for another 10 minutes or until the pizza has turned a golden brown color."},
            {text: "Sprinkle with oregano and serve."}]` },
          { role: 'user', content: 'Extract step texts used in this recipe: {recipeText}. Generate JSON as the following format {steps: [{text: string}]}' }
        ]
      )
  },
  // These are the prompts to generate new description for recipe
  generateDescription: {
    default:
      new LLMPrompt(
        'You are a helpful assistant that generates new recipe descriptions.',
        [
          { role: 'user', content: 'Generate a new description from this recipe description: {recipeDescription}. Respond with the following JSON format {value: string}' }
        ]
      )
  },
  // These are the prompts to generate new name for recipe
  generateName: {
    default:
      new LLMPrompt(
        'You are a helpful assistant that generates new recipe names.',
        [
          { role: 'user', content: 'Generate a new name from this recipe name: {recipeName}. Respond with the following JSON format {value: string}' }
        ]
      ),
    dark:
      new LLMPrompt(
        'You are a helpful assistant that generates new recipe names.',
        [
          { role: 'user', content: 'Generate a new dark name from this recipe name: {recipeName}. Respond with the following JSON format {value: string}' }
        ]
      )
  },
  // These are the extracting resources from recipe prompts
  extractResources: {
    default:
      new LLMPrompt(
        'You are a helpful assistant that extracts recipe resources from recipe text data and return JSON.',
        [
          { role: 'user', content: 'Extract resources used in this recipe: {recipeText}. Respond with the following response format [{name: string; quantity: string; unit: string; }]' }
        ]
      )
  },
  // These are the extracting resources from step prompts
  extractResourcesFromStep: {
    default:
      new LLMPrompt(
        'You are a helpful assistant that extracts recipe resources from recipe step text data and return JSON.',
        [
          {
            role: 'user', content: `Extract resources used in this step: {stepText} which are part of this recipe {recipeText}.
            Respond with the following response format [{name: string; quantity: string; unit: string; }]` }
        ]
      )
  },
  // These are the simplifying language prompts
  simplifyRecipe: {
    default:
      new LLMPrompt(
        `Act as a culinary assistant focused on simplifying cooking methods.
      Make cooking accessible and straightforward for home cooks by providing the simplest methods to complete each step of a recipe.
      Always return response in JSON format`,
        [
          {
            role: 'user', content: `Simplify the language of the following recipe:
            "Preheat the oven to 400°F (200°C).
            Start by making the crust. Crack eggs into a medium-sized bowl and add the rest of the crust ingredients. Give it a good stir to combine.
            Line a pie plate (a normal sized pie plate is big enough for two portions), or any other ovenproof dish, with parchment paper (crumple the sheet before you flatten it out to make it stay down more easily). Pour in the pizza crust batter. Spread it out evenly with a spatula. Bake for 15 minutes until the pizza crust turns golden.
            Use a spatula to spread tomato sauce over the crust. Top with cheese.
            Bake for another 10 minutes or until the pizza has turned a golden brown color.
            Sprinkle with oregano and serve.".
            Response with the following format {value: string}.` },
          {
            role: 'assistant', content: `
            {value: "Preheat the oven to 400°F
                    In a medium bowl, combine the eggs, shredded mozzarella, cream cheese, salt and garlic powder
                    Line a pie plate or any ovenproof dish with parchment paper. Pour the crust mixture into the dish and spread it evenly with a spatula. Bake for 15 minutes, until the crust is golden.
                    Spread the tomato sauce over the baked crust. Top with shredded mozzarella cheese.
                    Bake for another 10 minutes, until the pizza is golden brown.
                    Sprinkle with dried oregano and serve."}.` },
          { role: 'user', content: 'Simplify the language of the following recipe: {recipeText}. Response with the following format {value: string}.' }
        ]
      )
  }
};

export default LLMPrompt