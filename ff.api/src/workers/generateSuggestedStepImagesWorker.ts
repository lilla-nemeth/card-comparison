import { createWorker } from "./workerFactory";
import { Job } from "bullmq";
import { GenerateSuggestedStepImagesQueueName } from "../queues/generateSuggestedStepImagesQueue";
import { S3, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { Buffer } from "buffer";

import Recipe, { RecipeProcessingState } from "../models/recipeModel";
import { addEventHandlers } from "./eventHandlers";
import { IStep } from "../models/stepModel";

export interface GenerateSuggestedImagesJobData {
  recipeId: string;
  stepId: string;
}

const apiId = "DO00NLJKCW6MF2YV9F9W"
const secretKey = "aQTbZF5v1sTxX2uyQN33NiH/Qg8IYhaoOpESog2FZjc"
const bucketName = "recipemedia"
const region = "fra1.digitaloceanspaces.com"

const generateSuggestedStepImagesWorker = createWorker<GenerateSuggestedImagesJobData>(
  GenerateSuggestedStepImagesQueueName, async (job: Job<GenerateSuggestedImagesJobData>) => {
    console.log('generateSuggestedStepImagesWorker picked up job', job.id, job.data);
    const childrenValues = await job.getChildrenValues();
    const urls = Object.values(childrenValues).sort()

    try {
      const recipe = await Recipe.findById(job.data.recipeId);
      if (!recipe || recipe.steps.length === 0) {
        throw new Error('Recipe or steps not found')
      }

      let step: IStep | undefined;
      recipe.steps?.some(mainStep => {
        step = mainStep.subSteps?.find(ss => ss._id.toString() === job.data.stepId);
        return step !== undefined;
      });

      if (!step?.text) {
        throw new Error('Step text not generated')
      }

      const s3Client = new S3({
        forcePathStyle: false,
        endpoint: `https://${region}`,
        region: 'us-east-1',
        credentials: {
          accessKeyId: apiId,
          secretAccessKey: secretKey
        }
      });

      // Iterate over all images in the result data
      const imageUrls: { image: string }[] = [];

      for (let i = 0; i < urls.length; i++) {
        const imageResponse = await fetch(urls[i]);

        if (!imageResponse.ok) {
          throw new Error(`Error: ${imageResponse.status} ${imageResponse.statusText}`);
        }

        const imageBuffer = await imageResponse.arrayBuffer();

        const uploadParams: PutObjectCommandInput = {
          Bucket: bucketName,
          Key: `${recipe._id.toString()}/${step!._id.toString()}-${i}.png`,
          Body: Buffer.from(imageBuffer),
          ContentType: "image/png",
          ACL: "public-read",
        };

        // Upload each image to S3
        await s3Client.send(new PutObjectCommand(uploadParams));
        console.log(`successfully uploaded image ${i + 1} to s3`);

        // Store the image URL for later use
        const imageUrl = `https://${bucketName}.${region}/${recipe._id.toString()}/${step!._id.toString()}-${i}.png`;
        imageUrls.push({ image: imageUrl });
      }

      await Recipe.updateOne(
        { _id: job.data.recipeId, 'steps.subSteps._id': job.data.stepId }, // Match the specific document and subdocument
        {
          $set: {
            // This define the fields to update and subStep is the array element to update which are used in arrayFilters
            'steps.$[].subSteps.$[subStep].suggestedMedias': imageUrls,
            'steps.$[].subSteps.$[subStep].reviewStatus.mediaGenerated': true
          }
        },
        {
          // subStep is defined in $set function
          arrayFilters: [{ 'subStep._id': job.data.stepId }], // Apply to the specific subStep
        }
      );
    } catch (error) {
      console.log('failed to generate image', error);
      throw error;
    }
  }, {
  concurrency: 3
})

export default generateSuggestedStepImagesWorker;

async function customCompletedHandler(job: Job<GenerateSuggestedImagesJobData>, result: Response): Promise<void> {
  try {
    const recipe = await Recipe.findById(job.data.recipeId);
    if (!recipe || recipe.steps.length === 0) {
      throw new Error('Recipe or steps not found')
    }

    if (recipe) {
      const allStepsHaveSuggestedMedias = recipe.steps.every((step) => {
        return step.subSteps?.every((subStep) => {
          return subStep.suggestedMedias && subStep.suggestedMedias.length > 0;
        });
      });

      if (allStepsHaveSuggestedMedias) {
        recipe.processingState = RecipeProcessingState.Processed;
      }
    } else {
      console.log('Recipe not found');
    }
  } catch (error) {
    console.log('failed to check recipe state');
  }
}

addEventHandlers(generateSuggestedStepImagesWorker, customCompletedHandler);