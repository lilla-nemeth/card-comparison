import { createWorker } from "./workerFactory";
import { Job } from "bullmq";
import { GenearateStepImageQueueName } from "../queues/generateStepImageQueue";

import Recipe from "../models/recipeModel";
import { addEventHandlers } from "./eventHandlers";
import { IStep } from "../models/stepModel";
import CrewActions from "./CrewActions";

export interface GenerateImageJobData {
  recipeId: string;
  stepId: string;
}

const generateStepImageWorker = createWorker<GenerateImageJobData>(
  GenearateStepImageQueueName, async (job: Job<GenerateImageJobData>) => {
    console.log('generateStepImageWorker picked up job', job.id, job.data);
    try {
      const recipe = await Recipe.findById(job.data.recipeId);
      if (!recipe || recipe.steps.length === 0) {
        throw new Error('Recipe or steps not found')
      }

      let step: IStep | undefined;
      recipe.steps?.some(mainStep => {
        step = mainStep.subSteps?.find(ss => ss._id.toString() === job.data.stepId);
        return step !== undefined;
      });

      if (!step?.text) {
        throw new Error('Step text not generated')
      }

      const action = CrewActions.generateStepImage();
      const result = await action.executeRequest({ recipe_step: step.text });
      console.log('generateStepImageWorker received url', result.image_url);
      return result.image_url;
    } catch (error) {
      console.log('failed to generate image', error);
      throw error;
    }
  }, {
  concurrency: 3
})

export default generateStepImageWorker;

addEventHandlers(generateStepImageWorker);