import { Job, Worker} from "bullmq";

type CompletedHandler<DataType, ReturnType> = (job: Job<DataType>, result: ReturnType) => void;
type FailedHandler<DataType> = (job: Job<DataType> | undefined, err: Error) => void;

export function addEventHandlers<DataType, ReturnType>(
  worker: Worker<DataType, ReturnType>,
  customCompletedHandler?: CompletedHandler<DataType, ReturnType>,
  customFailedHandler?: FailedHandler<DataType>
): void {
  worker.on('completed', (job: Job<DataType>, result: ReturnType) => {
    console.log(`Worker ${worker.name} completed Job ${job.id} with result:`, result)
    customCompletedHandler?.(job, result)
  })

  worker.on('failed', (job: Job<DataType> | undefined, err: Error) => {
    console.log(`Worker ${worker.name} failed Job ${job?.id} with error: ${err.message}`)
    customFailedHandler?.(job, err)
  })
}