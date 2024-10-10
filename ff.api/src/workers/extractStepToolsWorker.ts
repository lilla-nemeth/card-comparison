import { createWorker } from "./workerFactory";
import { Job } from "bullmq";
import { ExtractStepToolsName, ExtractStepToolsData } from "../queues/extractStepToolsQueue";
import Recipe from "../models/recipeModel";
import { addEventHandlers } from "./eventHandlers";
import { IStep } from "../models/stepModel";
import FFCRewHttpService from "../services/ffCrewHttpService";
import { LLMPrompts } from './LLMPrompts';

const http = new FFCRewHttpService();

const extractStepToolsWorker = createWorker<ExtractStepToolsData>(
  ExtractStepToolsName, async (job: Job) => {
    console.log('extractStepToolsWorker picked up job', job.id);
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

      const result = await http.sendHttpRequest(LLMPrompts.extractStepTools.default, { step_text: step.text });
      if (!result.tools) {
        throw new Error('Extract step tools failed')
      }
      await Recipe.updateOne(
        { _id: job.data.recipeId, 'steps.subSteps._id': job.data.stepId },
        {
          $set: {
            'steps.$[].subSteps.$[subStep].tools': result.tools
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

export default extractStepToolsWorker;

addEventHandlers(extractStepToolsWorker)