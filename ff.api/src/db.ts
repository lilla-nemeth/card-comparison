import mongoose from 'mongoose';

//TODO configure it properly

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://host.docker.internal:27017/FixFoodDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;