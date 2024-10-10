import { Data } from "../workers/atomizeStepWorker";
import { createQueue } from "./queueFactory";

export const AtomizeStepQueueName = 'AtomizeStepQueueName';
const atomizeStepQueue = createQueue(AtomizeStepQueueName, {
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
export default atomizeStepQueue;

export const addJobToAtomizeStepQueue = async (data: Data) => {
  try {
    const job = await atomizeStepQueue.add('process-atomize-steps', data);
    console.log(`Atomize step job added with ID: ${job.id}`);
    return job;
  } catch (error) {
    console.log('Failed to add job to the queue', error);
    throw error;
  }
};