import mongoose from "mongoose";
import {SECREATS} from "./index.js"

const connectToDatabase = async () => {
  try {
    // Use 127.0.0.1 instead of localhost
    await mongoose.connect(SECREATS.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
};

connectToDatabase();

