import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/URL-SHORTNER");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
};

connectToDatabase();
