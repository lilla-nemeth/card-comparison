import { createWorker } from "./workerFactory";
import { addEventHandlers } from "./eventHandlers";
import { Job } from "bullmq";

import { GenerateTemplateLiteralData, GenerateTemplateLiteralQueueName } from "../queues/generateTemplateLiteralQueue";
import Recipe from "../models/recipeModel";
import { IStep } from "../models/stepModel";
import FFCRewHttpService from "../services/ffCrewHttpService";
import { LLMPrompts } from './LLMPrompts';

const http = new FFCRewHttpService();

const generateTemplateLiteralWorker = createWorker<GenerateTemplateLiteralData>(
  GenerateTemplateLiteralQueueName, async (job: Job) => {
    console.log('generateTemplateLiteralWorker picked up job', job.id);
    try {
      const recipe = await Recipe.findById(job.data.recipeId);
      if (!recipe) {
        throw new Error('Recipe not found')
      }

      let step: IStep | undefined;
      recipe.steps?.some(mainStep => {
        step = mainStep.subSteps?.find(ss => ss._id.toString() === job.data.stepId);
        return step !== undefined;
      });

      if (!step?.text) {
        throw new Error('Step text not generated')
      }

      const result = await http.sendHttpRequest(
        LLMPrompts.generateTemplateLiteral.default,
        { stepText: step.text, ingredient: JSON.stringify(step.resources) }
      );
      if (!result.value) {
        throw new Error('Generating template literal failed')
      }

      await Recipe.updateOne(
        { _id: job.data.recipeId, 'steps.subSteps._id': job.data.stepId },
        {
          $set: {
            'steps.$[].subSteps.$[subStep].textTemplateLiteral': result.value
          }
        },
        {
          arrayFilters: [{ 'subStep._id': job.data.stepId }]
        }
      );
    } catch (error) {
      throw error;
    }
  }, {
  concurrency: 3
})

export default generateTemplateLiteralWorker;

addEventHandlers(generateTemplateLiteralWorker);