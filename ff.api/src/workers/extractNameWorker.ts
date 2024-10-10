import { createWorker } from "./workerFactory";
import { Job } from "bullmq";
import { ExtractNameQueueName } from "../queues/extractNameQueue";
import Recipe from "../models/recipeModel";
import CrewActions from "./CrewActions";
import { addEventHandlers } from "./eventHandlers";

export interface Data {
  recipeId: string;
}

const extractNameWorker = createWorker<Data>(
  ExtractNameQueueName, async (job: Job) => {
    console.log('extractNameWorker picked up job', job.id);
    try {
      const recipe = await Recipe.findById(job.data.recipeId);
      if (!recipe?.simplifiedData) {
        throw new Error('Recipe data not simplified')
      }
      const action = CrewActions.extractNameAndDescription();
      const result = await action.executeRequest({ recipe_text: recipe.simplifiedData.toString() });
      recipe.description = result.result.description;
      recipe.name = result.result.name;
      await recipe.save();
    } catch (error) {
      throw error;
    }
  }, {
  concurrency: 3
})

export default extractNameWorker;

addEventHandlers(extractNameWorker)