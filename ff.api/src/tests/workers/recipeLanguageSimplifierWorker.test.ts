import { Job, Worker } from 'bullmq';
import recipeLanguageSimplifierQueue, { addJobToRecipeLanguageSimplifierQueue, RecipeQueueName } from '../../queues/languageSimplifierQueue';
import recipeLanguageSimplifierWorker, { Data } from '../../workers/languageSimplifierWorker'

describe('Worker', () => {
  let queue = recipeLanguageSimplifierQueue
  let consoleLogSpy: jest.SpyInstance;
  let workerInstance: Worker;

  beforeEach(() => {
    // consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    workerInstance = recipeLanguageSimplifierWorker;
  });

  afterAll(async () => {
    // consoleLogSpy.mockRestore();
    await workerInstance.close()
    await queue.close()
  });

  it('should create a worker with the correct queue name and concurrency', () => {
    expect(workerInstance.opts.concurrency).toBe(3);
    expect(workerInstance.name).toBe(RecipeQueueName);
  });

  // it('should log job completion and call custom completed handler', async () => {
  it('should process a job and return the expected result', (done) => {
    const jobData: Data = { recipeId: '12345' };

    addJobToRecipeLanguageSimplifierQueue(jobData)

    console.log(workerInstance.name)
    console.log(queue.name)

    workerInstance.on('completed', (job: Job<Data>) => {
      console.log('workerInstance oncomplete in test!!', job.returnvalue)
      // Write asserts here
      done()
    })
  });

  // it('should call customCompletedHandler when a job is completed', () => {

  // });

  // it('should call customFailedHandler when a job fails', () => {

  // });
});
