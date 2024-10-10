import { createWorker } from '../../workers/workerFactory';
import { Worker, Queue } from 'bullmq';
import { Job } from 'bullmq';

jest.mock('bullmq')

describe('Worker Factory', () => {
  let MockedQueue: jest.MockedClass<typeof Queue>
  let MockedWorker: jest.MockedClass<typeof Worker>

  beforeAll(() => {
    MockedQueue = Queue as jest.MockedClass<typeof Queue>
    MockedWorker = Worker as jest.MockedClass<typeof Worker>
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  it('should create a worker with the correct queue name', async () => {
    const queueName = 'testQueue';
    const mockProcessor = jest.fn(async (job: Job) => ({ result: true }))

    const worker = createWorker(queueName, mockProcessor)

    expect(MockedWorker).toHaveBeenCalledWith(
      queueName,
      mockProcessor,
      expect.any(Object)
    )
    expect(worker).toBeInstanceOf(Worker)
  });
});
