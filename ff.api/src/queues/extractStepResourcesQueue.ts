import { createQueue } from "./queueFactory";

export interface ExtractStepResourcesData {
  recipeId: string;
  stepId: string;
}

export const ExtractStepResourcesName = 'ExtractStepResource';
const extractStepResourcesQueue = createQueue(ExtractStepResourcesName, {
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
export default extractStepResourcesQueue;

export const addJobToExtracStepResourcesQueue = async (data: ExtractStepResourcesData) => {
  try {
    const job = await extractStepResourcesQueue.add('process-extract-step-resources', data);
    console.log(`Extract steps job added with ID: ${job.id}`);
    return job;
  } catch (error) {
    console.log('Failed to add job to the queue', error);
    throw error;
  }
};