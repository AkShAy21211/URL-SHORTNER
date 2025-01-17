import { UrlModel } from "../models/index.js";
import { logger } from "../config/index.js";


export const findUrlByOriginalUrl = async (longUrl) => {
  try {
    const url = await UrlModel.findOne({ longUrl }).exec();
    return url;
  } catch (error) {
    logger.error("Error finding URL by original URL", error);
  }
};


export const createUrl = async (urlData) =>{
  try {
    const newUrl = new UrlModel(urlData);
    await newUrl.save();
    return newUrl;
  } catch (error) {
    logger.error("Error creating URL", error);
  }
}