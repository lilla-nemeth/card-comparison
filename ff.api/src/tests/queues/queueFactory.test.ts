import { createQueue } from '../../queues/queueFactory';
import { Queue } from 'bullmq';

describe('Queue Factory', () => {
  it('should create a queue with the correct name and options', () => {
    const queueName = 'testQueue';
    const queue = createQueue(queueName);

    expect(queue).toBeInstanceOf(Queue);
    expect(queue.name).toBe(queueName);
    queue.close();
  });
});
