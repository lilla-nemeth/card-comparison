import { createQueue } from "./queueFactory";

export const ExtractNameQueueName = 'recipeExtractNameQueueName';
const extractNameQueue = createQueue(ExtractNameQueueName, {
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
export default extractNameQueue;

export const addJobToRecipeExtractNameQueue = async (data: { recipeId: string }) => {
  try {
    const job = await extractNameQueue.add('process-extract-name', data);
    console.log(`Extract name job added with ID: ${job.id}`);
    return job;
  } catch (error) {
    console.log('Failed to add job to the queue', error);
    throw error;
  }
};