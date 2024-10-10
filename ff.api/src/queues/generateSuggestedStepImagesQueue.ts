import { createQueue } from "./queueFactory";

export const GenerateSuggestedStepImagesQueueName = 'GenerateSuggestedStepImagesQueue';
const generateSuggestedStepImagesQueue = createQueue(GenerateSuggestedStepImagesQueueName, {
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
export default generateSuggestedStepImagesQueue;