import { createQueue } from "./queueFactory";

export interface GenerateTemplateLiteralData {
  recipeId: string;
  stepId: string;
}

export const GenerateTemplateLiteralQueueName = 'GenerateTemplateLiteralQueueName';
const generateTemplateLiteralQueue = createQueue(GenerateTemplateLiteralQueueName, {
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
export default generateTemplateLiteralQueue;

export const addJobToGenerateTemplateLiteralQueue = async (data: GenerateTemplateLiteralData) => {
  try {
    const job = await generateTemplateLiteralQueue.add('process-generate-template-literal', data);
    console.log(`Generatel template literal job added with ID: ${job.id}`);
    return job;
  } catch (error) {
    console.log('Failed to add job to the queue', error);
    throw error;
  }
};