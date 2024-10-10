import { createWorker } from "./workerFactory";
import { Job } from "bullmq";
import { ExtractStepQueueName } from "../queues/extractStepsQueue";
import Recipe from "../models/recipeModel";
import CrewActions from "./CrewActions";
import { addEventHandlers } from "./eventHandlers";
import { addJobToAtomizeStepQueue } from "../queues/atomizeStepQueue";

export interface Data {
  recipeId: string;
}

const extractStepsWorker = createWorker<Data>(
  ExtractStepQueueName, async (job: Job) => {
    console.log('extractStepsWorker picked up job', job.id);
    try {
      const recipe = await Recipe.findById(job.data.recipeId);
      if (!recipe?.simplifiedData) {
        throw new Error('Recipe data not simplified')
      }
      const action = CrewActions.extractSteps();
      const result = await action.executeRequest({ recipe_text: recipe.simplifiedData.toString() });
      if (!result.result.steps) {
        throw new Error('Recipe step extraction failed')
      }
      recipe.steps = result.result.steps;
      await recipe.save();
    } catch (error) {
      throw error;
    }
  }, {
  concurrency: 3
})

export default extractStepsWorker;

function customCompletedHandler(job: Job<Data>, result: Response): void {
  addJobToAtomizeStepQueue({ recipeId: job.data.recipeId });
}

addEventHandlers(extractStepsWorker, customCompletedHandler)