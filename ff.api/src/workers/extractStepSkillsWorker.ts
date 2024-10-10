import { createWorker } from "./workerFactory";
import { Job } from "bullmq";
import { ExtractStepSkillsName, ExtractStepSkillData } from "../queues/extractStepSkillsQueue";
import Recipe from "../models/recipeModel";
import { addEventHandlers } from "./eventHandlers";
import { IStep } from "../models/stepModel";
import FFCRewHttpService from "../services/ffCrewHttpService";
import { LLMPrompts } from './LLMPrompts';

const http = new FFCRewHttpService();

const extractStepSkillsWorker = createWorker<ExtractStepSkillData>(
  ExtractStepSkillsName, async (job: Job) => {
    console.log('extractStepSkillsWorker picked up job', job.id);
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

      const result = await http.sendHttpRequest(LLMPrompts.extractStepSkills.default, { step_text: step.text });
      if (!result.skills) {
        throw new Error('Extract step skills failed')
      }
      await Recipe.updateOne(
        { _id: job.data.recipeId, 'steps.subSteps._id': job.data.stepId },
        {
          $set: {
            'steps.$[].subSteps.$[subStep].skills': result.skills
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

export default extractStepSkillsWorker;

addEventHandlers(extractStepSkillsWorker)