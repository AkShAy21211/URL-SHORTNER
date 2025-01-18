import mongoose from "mongoose";
import { SECREATS, logger } from "./index.js";

const connectToDatabase = async () => {
  try {
    // Use 127.0.0.1 instead of localhost
    mongoose.connect(SECREATS.MONGO_URL);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Failed to connect to MongoDB", error);
  }
};

connectToDatabase();
