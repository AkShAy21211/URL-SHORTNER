import { UserModel } from "../models/index.js";
import logger from "../config/logger.js";

export const createUser = async (userData) => {
  try {
    const user = await UserModel.create(userData);
    return user;
  } catch (error) {
    logger.error("Error creating user", error);
  }
};

export const findUserByGoogleId = async (googleId) => {
  try {
    
    const user = await UserModel.findOne({ googleId });
    
    return user;
  } catch (error) {
    logger.error("Error finding user", error);
  }
};

