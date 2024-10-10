import './models'
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.VITE_MONGODB_URI as string);
  } catch (error) {
    console.error(
      "Error connecting to MongoDB:",
      error instanceof Error ? error.message : error,
    );
  }
};

const closeDatabaseConnection = async () => {
  try {
    await mongoose.disconnect();
    console.log("Successfully disconnected from MongoDB");
  } catch (error) {
    console.error(
      "Error disconnecting from MongoDB:",
      error instanceof Error ? error.message : error,
    );
  }
};

export { connectToDatabase, closeDatabaseConnection };
