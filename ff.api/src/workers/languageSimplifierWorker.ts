import { createWorker } from "./workerFactory";
import { addEventHandlers } from "./eventHandlers";
import { Job } from "bullmq";
import { RecipeQueueName } from "../queues/languageSimplifierQueue";
import { addJobToRecipeExtractNameQueue } from "../queues/extractNameQueue";
import { addJobToExtracStepsQueue } from "../queues/extractStepsQueue";
import Recipe, { RecipeProcessingState } from "../models/recipeModel";
import CrewActions from "./CrewActions";

export interface Data {
  recipeId: string;
}

const languageSimplifierWorker = createWorker<Data>(
  RecipeQueueName, async (job: Job) => {
    console.log('languageSimplifierWorker picked up job', job.id);
    try {
      const recipe = await Recipe.findById(job.data.recipeId);
      if (!recipe?.rawData) {
        throw new Error('Recipe raw data not found')
      }

      recipe.processingState = RecipeProcessingState.Processing;
      await recipe.save();

      const action = CrewActions.simplifyRecipe();
      const result = await action.executeRequest({ recipe_text: recipe.rawData.toString() });
      if (!result.result.validated_text) {
        throw new Error('Recipe simplification failed')
      }
      recipe.simplifiedData = result.result.validated_text;
      await recipe.save();
    } catch (error) {
      throw error;
    }
  }, {
  concurrency: 3
})

export default languageSimplifierWorker;

function customCompletedHandler(job: Job<Data>, result: Response): void {
  addJobToRecipeExtractNameQueue({ recipeId: job.data.recipeId });
  addJobToExtracStepsQueue({ recipeId: job.data.recipeId });
}

// Custom failed handler
function customFailedHandler(job: Job<Data> | undefined, err: Error): void {
  console.log(`Custom logic: Job ${job?.id} failed`);
  // Additional custom logic here
}

// Add event handlers to the worker, including custom ones
addEventHandlers(languageSimplifierWorker, customCompletedHandler, customFailedHandler);