import { afterAll, beforeAll, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import recipeLanguageSimplifierQueue from "./src/queues/languageSimplifierQueue";
import recipeExtractNameQueue from "./src/queues/extractNameQueue";
import atomizeStepQueue from "./src/queues/atomizeStepQueue";
import extractStepQueue from "./src/queues/extractStepsQueue";

import recipeLanguageSimplifierWorker from "./src/workers/languageSimplifierWorker";
import recipeExtractNameWorker from "./src/workers/extractNameWorker";
import atomizeStepWorker from "./src/workers/atomizeStepWorker";
import extractStepsWorker from "./src/workers/extractStepsWorker";


beforeAll(async () => {
  const mongoUri = `${process.env.VITE_MONGODB_URI}-test`;
  if (!mongoUri) {
    console.error("VITE_MONGODB_URI environment variable is not set");
    return;
  }

  try {
    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error(
      "Error connecting to MongoDB:",
      error instanceof Error ? error.message : error,
    );
  }
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await recipeLanguageSimplifierWorker.close();
  await recipeExtractNameWorker.close();
  await extractStepsWorker.close();
  await atomizeStepWorker.close();

  await recipeLanguageSimplifierQueue.close();
  await recipeExtractNameQueue.close();
  await extractStepQueue.close();
  await atomizeStepQueue.close();
});
