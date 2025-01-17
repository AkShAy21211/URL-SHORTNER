import { UrlModel, TrackingModel, AnalyticsModel } from "../models/index.js";
import { logger } from "../config/index.js";
import mongoose, { Types } from "mongoose";

export const findUrlByOriginalUrl = async (longUrl) => {
  try {
    const url = await UrlModel.findOne({ longUrl }).exec();
    return url;
  } catch (error) {
    logger.error("Error finding URL by original URL", error);
  }
};

export const createUrl = async (urlData) => {
  try {
    const newUrl = new UrlModel(urlData);
    await newUrl.save();
    return newUrl;
  } catch (error) {
    logger.error("Error creating URL", error);
  }
};

export const findUrlByCustomAlias = async (customAlias) => {
  try {
    const url = await UrlModel.findOne({ customAlias }).exec();
    return url;
  } catch (error) {
    logger.error("Error finding URL by alias", error);
  }
};

export const findUrlByTopic = async (topic) => {
  try {
    const urls = await UrlModel.find({ topic }).exec();
    return urls;
  } catch (error) {
    logger.error("Error finding URL by alias", error);
  }
};

export const createRedirectLogs = async (trackingData) => {
  try {
    const newLog = new TrackingModel(trackingData);
    await newLog.save();
    return newLog;
  } catch (error) {
    logger.error("Error creating redirect logs", error);
  }
};
export const updateAnalyticsBreakdown = async (trackingData) => {
  try {
    const existingUrlAnalytics = await AnalyticsModel.findOne({
      urlId: trackingData.urlId,
    });
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();

    if (existingUrlAnalytics) {
      let { userId, clickByDate, osType, deviceType } = existingUrlAnalytics;
      const isUserExists = userId.includes(trackingData.userId);
      const updateAnalytics = {};

      // Handle clickByDate
      const existingDateIndex = clickByDate.findIndex(
        (date) => new Date(date.date).toLocaleDateString() === formattedDate
      );
      if (existingDateIndex > -1) {
        clickByDate[existingDateIndex].clickCount++;
      } else {
        clickByDate.push({
          date: new Date(),
          clickCount: 1,
        });
      }

      // Handle user clicks for OS type
      if (isUserExists) {
        const existingOSIndex = osType.findIndex(
          (os) => os.osName === trackingData.osName && !isUserExists
        );
        if (existingOSIndex > -1) {
          osType[existingOSIndex].uniqueClicks++;
        }

        // Handle device type tracking
        const existingDeviceIndex = deviceType.findIndex(
          (device) =>
            device.deviceName === trackingData.deviceName && !isUserExists
        );
        if (existingDeviceIndex > -1) {
          deviceType[existingDeviceIndex].uniqueClicks++;
        }

        updateAnalytics.clickByDate = clickByDate;
        updateAnalytics.osType = osType;
        updateAnalytics.deviceType = deviceType;

        await AnalyticsModel.updateOne(
          { _id: existingUrlAnalytics._id },
          { $set: updateAnalytics, $inc: { totalClicks: 1 } }
        );
      } else {
        userId.push(trackingData.userId);

        updateAnalytics.userId = userId;
        updateAnalytics.clickByDate = clickByDate;
        updateAnalytics.osType = osType;
        updateAnalytics.deviceType = deviceType;

        await AnalyticsModel.updateOne(
          { _id: existingUrlAnalytics._id },
          { $set: updateAnalytics, $inc: { totalClicks: 1, uniqueUsers: 1 } }
        );
      }
      return existingUrlAnalytics;
    } else {
      const newUrlAnalytics = new AnalyticsModel({
        urlId: trackingData.urlId,
        userId: [trackingData.userId],
        uniqueUsers: 1,
        clickByDate: [
          {
            date: new Date(),
            clickCount: 1,
          },
        ],
        osType: [
          {
            osName: trackingData.osName,
            uniqueClicks: 1,
            uniqueUsers: 1,
          },
        ],
        deviceType: [
          {
            deviceName: trackingData.deviceName,
            uniqueClicks: 1,
            uniqueUsers: 1,
          },
        ],
        totalClicks: 1,
      });
      await newUrlAnalytics.save();

      return newUrlAnalytics;
    }
  } catch (error) {
    logger.error("Error updating analytics breakdown", error);
  }
};

export const findUrlAnalytics = async (customAlias) => {
  try {
    const [urlAnalytics] = await UrlModel.aggregate([
      { $match: { customAlias } },
      {
        $lookup: {
          from: "analytics",
          localField: "_id",
          foreignField: "urlId",
          as: "analyticsData",
        },
      },
      { $unwind: { path: "$analyticsData", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          analyticsData: {
            totalClicks: 1,
            uniqueUsers: 1,
            clickByDate: {
              $slice: ["$analyticsData.clickByDate", -7],
            },
            osType: {
              osName: 1,
              uniqueClicks: 1,
              uniqueUsers: 1,
            },
            deviceType: {
              deviceName: 1,
              uniqueClicks: 1,
              uniqueUsers: 1,
            },
          },
        },
      },
    ]);

    return urlAnalytics;
  } catch (error) {
    logger.error("Error finding URL analytics by alias", error);
  }
};

export const findUrlAnalyticsByTopic = async (topic) => {
  try {
    const [urlAnalytics] = await UrlModel.aggregate([
      { $match: { topic } },

      {
        $lookup: {
          from: "analytics",
          localField: "_id",
          foreignField: "urlId",
          as: "analyticsData",
        },
      },

      { $unwind: { path: "$analyticsData", preserveNullAndEmptyArrays: true } },

      {
        $group: {
          _id: "$topic",
          totalClicks: { $sum: "$analyticsData.totalClicks" },
          uniqueUsers: { $sum: "$analyticsData.uniqueUsers" },
          clicksByDate: {
            $push: "$analyticsData.clickByDate",
          },
          urls: {
            $push: {
              shortUrl: "$shortUrl",
              totalClicks: "$analyticsData.totalClicks",
              uniqueUsers: "$analyticsData.uniqueUsers",
            },
          },
        },
      },

      {
        $addFields: {
          clicksByDate: {
            $reduce: {
              input: "$clicksByDate",
              initialValue: [],
              in: {
                $concatArrays: ["$$value", "$$this"],
              },
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
        },
      },
    ]);

    return urlAnalytics;
  } catch (error) {
    logger.error("Error finding URL analytics by alias", error);
  }
};

export const findOverallAnalytics = async (userId) => {

  const [overallAnalytics] = await UrlModel.aggregate([
    { $match: { userId: new  Types.ObjectId(userId)} },
    {
      $lookup: {
        from: "analytics",
        localField: "_id",
        foreignField: "urlId",
        as: "analyticsData",
      },
    },
    { $unwind: { path: "$analyticsData", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: null,
        totalUrls: { $sum: 1 },
        totalClicks: { $sum: { $ifNull: ["$analyticsData.totalClicks", 0] } },
        uniqueUsers: { $sum: { $ifNull: ["$analyticsData.uniqueUsers", 0] } },
        clicksByDate: {
          $push: {
            $ifNull: ["$analyticsData.clickByDate", []],
          },
        },
        osType: {
          $push: {
            $ifNull: ["$analyticsData.osType", []],
          },
        },
        deviceType: {
          $push: {
            $ifNull: ["$analyticsData.deviceType", []],
          },
        },
      },
    },
    
  ]);

  return overallAnalytics;
  
};
