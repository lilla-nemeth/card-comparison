import { createWorker } from "./workerFactory";
import { Job } from "bullmq";
import { ExtractStepResourcesName, ExtractStepResourcesData } from "../queues/extractStepResourcesQueue";
import Recipe from "../models/recipeModel";
import { addEventHandlers } from "./eventHandlers";
import { IStep } from "../models/stepModel";
import FFCRewHttpService from "../services/ffCrewHttpService";
import { LLMPrompts } from './LLMPrompts';

const http = new FFCRewHttpService();

const extractStepResourcesWorker = createWorker<ExtractStepResourcesData>(
  ExtractStepResourcesName, async (job: Job) => {
    console.log('extractStepResourcesWorker picked up job', job.id);
    try {
      const recipe = await Recipe.findById(job.data.recipeId);
      if (!recipe?.simplifiedData) {
        throw new Error('Recipe data not simplified')
      }

      let step: IStep | undefined;
      recipe.steps?.some(mainStep => {
        step = mainStep.subSteps?.find(ss => ss._id.toString() === job.data.stepId);
        return step !== undefined;
      });

      if (!step?.text) {
        throw new Error('Step text not generated')
      }

      const result = await http.sendHttpRequest(LLMPrompts.extractStepResources.default, { recipe_text: recipe.simplifiedData.toString(), step_text: step.text });
      if (!result.resources) {
        throw new Error('Extract step resources failed')
      }
      await Recipe.updateOne(
        { _id: job.data.recipeId, 'steps.subSteps._id': job.data.stepId },
        {
          $set: {
            'steps.$[].subSteps.$[subStep].resources': result.resources
          }
        },
        {
          arrayFilters: [{ 'subStep._id': job.data.stepId }]
        }
      );
      await recipe.save();
    } catch (error) {
      throw error;
    }
  }, {
  concurrency: 3
})

export default extractStepResourcesWorker;

addEventHandlers(extractStepResourcesWorker)