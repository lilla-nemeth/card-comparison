import { createWorker } from "./workerFactory";
import { FlowProducer, Job } from "bullmq";
import { addJobToAtomizeStepQueue, AtomizeStepQueueName } from "../queues/atomizeStepQueue";
import Recipe, { IRecipe } from "../models/recipeModel";
import { addEventHandlers } from "./eventHandlers";
import CrewActions from "./CrewActions";
import { GenerateSuggestedStepImagesQueueName } from "../queues/generateSuggestedStepImagesQueue";
import { redisOptions } from "../config/redisConfig";
import { GenearateStepImageQueueName } from "../queues/generateStepImageQueue";
import { addJobToExtracStepSkillsQueue } from "../queues/extractStepSkillsQueue";
import { addJobToExtracStepToolsQueue } from "../queues/extractStepToolsQueue";
import { addJobToExtracStepResourcesQueue } from "../queues/extractStepResourcesQueue";

export interface Data {
  recipeId: string;
  stepIndex?: number;
  previousAtomizedSteps?: string[];
}

function createImageGenerationJobs(
  recipeId: string,
  stepId: string,
  numberOfImages: number,
  queueName: string
) {
  return Array.from({ length: numberOfImages }, (_, i) => ({
    name: `generateImage-${i + 1}`,
    queueName,
    data: { recipeId, stepId },
  }));
}

async function generateImagesForAllSteps(recipeId: string, recipe: IRecipe) {
  console.log('generating flow for generating images')
  const flowProducer = new FlowProducer({ connection: redisOptions });

  const bulkJobs = recipe.steps.filter(s => s.suggestedMedias?.length === 0).flatMap((mainStep) =>
    (mainStep.subSteps ?? []).map((subStep) => ({
      name: 'generateSuggestedImages',
      queueName: GenerateSuggestedStepImagesQueueName,
      data: {
        recipeId,
        stepId: subStep._id.toString(),
      },
      children: createImageGenerationJobs(
        recipeId,
        subStep._id.toString(),
        2, // Number of images to generate
        GenearateStepImageQueueName
      ),
    }))
  );

  try {
    // Use addBulk to add all jobs at once
    if (bulkJobs.length > 0) {
      await flowProducer.addBulk(bulkJobs);
      console.log(`Image generation jobs successfully added for recipe ${recipeId}`);
    }
  } catch (error) {
    console.error(`Error adding image generation jobs for recipe ${recipeId}:`, error);
    throw error; // Rethrow the error for upstream handling
  }
}

const atomizeStepWorker = createWorker<Data>(
  AtomizeStepQueueName,
  async (job: Job<Data>) => {
    console.log('atomizeStepWorker picked up job', job.id);
    try {
      const { recipeId, stepIndex = 0, previousAtomizedSteps = [] } = job.data;
      const recipe = await Recipe.findById(recipeId);
      if (!recipe || recipe.steps.length === 0) {
        throw new Error('Recipe or steps not found')
      }

      console.log(`Processing step ${stepIndex + 1}/${recipe.steps.length} for recipe ${recipeId}`);

      const currentStep = recipe.steps[stepIndex];
      const action = CrewActions.atomizeStep()
      const result = await action.executeRequest({
        current_step: currentStep.text,
        previous_steps: previousAtomizedSteps.join(', ')
      });

      console.log('result for atomizer', JSON.stringify(result.result.steps))

      previousAtomizedSteps.push(result.result.steps.map(step => step.text).join(', '));

      recipe.steps[stepIndex].subSteps = result.result.steps;
      await recipe.save();

      recipe.steps[stepIndex].subSteps?.forEach(async (subStep) => {
        await addJobToExtracStepSkillsQueue({ recipeId, stepId: subStep._id.toString() })
        await addJobToExtracStepToolsQueue({ recipeId, stepId: subStep._id.toString() })
        await addJobToExtracStepResourcesQueue({ recipeId: recipe._id.toString(), stepId: subStep._id.toString() })
      })

      if (stepIndex + 1 < recipe.steps.length) {
        await addJobToAtomizeStepQueue({
          recipeId,
          stepIndex: stepIndex + 1,
          previousAtomizedSteps
        })
      } else {
        // await generateImagesForAllSteps(job.data.recipeId, recipe);
      }
    } catch (error) {
      console.error(`Error processing job ${job.id} for recipe ${job.data.recipeId}:`, error);
      throw error;
    }
  }, {
  concurrency: 3
})

export default atomizeStepWorker;

addEventHandlers(atomizeStepWorker)