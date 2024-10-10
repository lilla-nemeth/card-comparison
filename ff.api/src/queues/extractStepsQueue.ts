import { createQueue } from "./queueFactory";

export const ExtractStepQueueName = 'ExtractStepQueueName';
const extractStepQueue = createQueue(ExtractStepQueueName, {
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
export default extractStepQueue;

export const addJobToExtracStepsQueue = async (data: { recipeId: string }) => {
  try {
    const job = await extractStepQueue.add('process-extract-steps', data);
    console.log(`Extract steps job added with ID: ${job.id}`);
    return job;
  } catch (error) {
    console.log('Failed to add job to the queue', error);
    throw error;
  }
};