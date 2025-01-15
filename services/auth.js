import { UserModel } from "../models";
import logger from "../config/logger.js";

export const createUser = async (userData) => {
  try {
    const user = await UserModel.create(userData);
    return user;
  } catch (error) {
    logger.error("Error creating user", error);
  }
};
