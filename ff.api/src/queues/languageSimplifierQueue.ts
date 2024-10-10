import { createQueue } from "./queueFactory";

export const RecipeQueueName = 'recipeLanguageSimplifierQueue';
const languageSimplifierQueue = createQueue(RecipeQueueName, {
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: false,
    removeOnFail: false,
    backoff: {
      type: 'exponential',
      delay: 5000
    }
  }
})
export default languageSimplifierQueue;

export const addJobToRecipeLanguageSimplifierQueue = async (data: { recipeId: string }) => {
  try {
    const job = await languageSimplifierQueue.add('process-language-simplifier', data);
    console.log(`Job added with ID: ${job.id}`);
    return job;
  } catch (error) {
    console.log('Failed to add job to the queue', error);
    throw error;
  }
};