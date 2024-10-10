import { Worker, WorkerOptions, Job } from "bullmq";
import { redisOptions } from "../config/redisConfig";

export function createWorker<DataType = any, ReturnType = any>(
  queueName: string,
  processor: (job: Job<DataType>) => Promise<ReturnType>,
  options?: Partial<WorkerOptions>
): Worker<DataType, ReturnType> {
  return new Worker<DataType, ReturnType>(
    queueName,
    processor,
    {
      connection: redisOptions,
      ...options
    })
}