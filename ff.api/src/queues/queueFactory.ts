import { Queue, QueueOptions } from "bullmq";
import { redisOptions } from "../config/redisConfig";

export function createQueue<T = any>(queueName: string, options?: Partial<QueueOptions>): Queue<T> {
  return new Queue<T>(queueName, {
    connection: redisOptions,
    ...options
  });
}