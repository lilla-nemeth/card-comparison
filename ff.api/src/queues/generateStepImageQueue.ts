import { GenerateImageJobData } from "../workers/generateStepImageWorker";
import { createQueue } from "./queueFactory";

export const GenearateStepImageQueueName = 'GenearateStepImageQueueName';
const genearateStepImageQueue = createQueue(GenearateStepImageQueueName, {
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
export default genearateStepImageQueue;

export const addJobToGenearateStepImageQueue = async (data: GenerateImageJobData) => {
  try {
    const job = await genearateStepImageQueue.add('process-generate-step-image', data);
    console.log(`Generate image to step job added with ID: ${job.id}`);
    return job;
  } catch (error) {
    console.log('Failed to add job to the queue', error);
    throw error;
  }
};