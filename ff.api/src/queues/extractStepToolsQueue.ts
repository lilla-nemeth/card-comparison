import { createQueue } from "./queueFactory";

export interface ExtractStepToolsData {
  recipeId: string;
  stepId: string;
}

export const ExtractStepToolsName = 'ExtractStepTools';
const extractStepToolsQueue = createQueue(ExtractStepToolsName, {
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
export default extractStepToolsQueue;

export const addJobToExtracStepToolsQueue = async (data: ExtractStepToolsData) => {
  try {
    const job = await extractStepToolsQueue.add('process-extract-step-tools', data);
    console.log(`Extract steps job added with ID: ${job.id}`);
    return job;
  } catch (error) {
    console.log('Failed to add job to the queue', error);
    throw error;
  }
};