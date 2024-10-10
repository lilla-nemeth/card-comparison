import { createWorker } from '../../workers/workerFactory';
import { createQueue } from '../../queues/queueFactory';
import { addEventHandlers } from '../../workers/eventHandlers';
import { Queue, Worker, Job } from 'bullmq';

describe('Event Handlers', () => {
  let queue: Queue;
  let worker: Worker;
  let consoleLogSpy: jest.SpyInstance;

  beforeAll(() => {
    queue = createQueue('testQueue');  // Use the real Redis instance
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(async () => {
    // Close worker instance so there isn't any hanging workers around
    if (worker) {
      await worker.close();
    }
    // Clear consoleLogSpy se it doesn't interfere with subsequent tests
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await queue.close();
    jest.restoreAllMocks();
  })

  it('should log job completion and call custom completed handler', async () => {
    const customCompletedHandler = jest.fn();

    worker = createWorker('testQueue', async (job: Job) => {
      console.log('processing job', job.id, job.data);
      return { result: true };
    });

    addEventHandlers(worker, customCompletedHandler);

    const newJob = await queue.add('testJob', { foo: 'bar' });

    // Wait for the job to be processed
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify that the default log was called
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'processing job',
      expect.any(String),
      { foo: 'bar' }
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(
      `Job ${newJob.id} completed with result:`,
      { result: true }
    );

    // Verify that the custom handler was called
    expect(customCompletedHandler).toHaveBeenCalled();
  });

  it('should log job failure and call custom failed handler', async () => {
    const customFailedHandler = jest.fn();

    worker = createWorker<any, any>('testQueue', async (job: Job<any, any>) => {
      throw new Error('test error');
    });

    addEventHandlers(worker, undefined, customFailedHandler);

    const job = await queue.add('testJob', { foo: 'bar' });

    // Wait for the job to be processed
    await new Promise(resolve => setTimeout(resolve, 500));

    // // Verify that the custom failed handler was called
    expect(customFailedHandler).toHaveBeenCalledWith(
      expect.objectContaining({ id: job.id }),
      expect.any(Error)
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(
      `Job ${job?.id} failed with error: test error`,
    );
  });
});
