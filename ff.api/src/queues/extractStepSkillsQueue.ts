import { createQueue } from "./queueFactory";

export interface ExtractStepSkillData {
  recipeId: string;
  stepId: string;
}

export const ExtractStepSkillsName = 'ExtractStepSkills';
const extractStepSkillsQueue = createQueue(ExtractStepSkillsName, {
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
export default extractStepSkillsQueue;

export const addJobToExtracStepSkillsQueue = async (data: ExtractStepSkillData) => {
  try {
    const job = await extractStepSkillsQueue.add('process-extract-step-skills', data);
    console.log(`Extract steps job added with ID: ${job.id}`);
    return job;
  } catch (error) {
    console.log('Failed to add job to the queue', error);
    throw error;
  }
};