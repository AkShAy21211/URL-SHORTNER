import { url } from "../services/index.js";
import { createUniqueId, geoipLite } from "../utils/index.js";
import { client, responseMessages } from "../config/index.js";
import { SECREATS } from "../config/index.js";
import requestIp from "request-ip";

export const shortenUrl = async (req, res) => {
  const { longUrl } = req.body;
  const customAlias = req.body.customAlias || "";
  const topic = req.body.topic || "";
  const userId = req.user.userId;

  const validateUrl = /^https?:\/\/.+/.test(longUrl);

  if (!longUrl || !validateUrl) {
    return res
      .status(responseMessages.error.URL_INVALID.statusCode)
      .json(responseMessages.error.URL_INVALID.message);
  }

  const existingUrl = await url.findUrlByOriginalUrl(longUrl);

  if (existingUrl) {
    return res.status(responseMessages.error.URL_EXIST.statusCode).json({
      message: responseMessages.error.URL_EXIST.message,
      shortUrl: `${SECREATS.BASE_URL}/api/url/${existingUrl.shortUrl}`,
      createdAt: existingUrl.createdAt,
    });
  }

  const shortUrl = createUniqueId();
  const newUrl = await url.createUrl({
    longUrl,
    shortUrl,
    customAlias,
    topic,
    userId,
  });

  if (newUrl) {
    return res.status(responseMessages.success.URL_SHORTENED.statusCode).json({
      message: responseMessages.success.URL_SHORTENED.message,
      shortUrl: `${SECREATS.BASE_URL}/api/url/${shortUrl}`,
      createdAt: newUrl.createdAt,
    });
  }

  return res.status(responseMessages.error.URL_SHORTEN_FAILED.statusCode).json({
    message: responseMessages.error.URL_SHORTEN_FAILED.message,
  });
};

export const redirectUrl = async (req, res) => {
  const { alias } = req.params;
  const key = req.originalUrl;

  const data = await client.get(key);
  const cachedData = await JSON.parse(data);

  if (cachedData) {
    // Extract data
    const userAgent = req.headers["user-agent"];
    const ipAddress = SECREATS.IP_ADDRESS;
    const geolocation = geoipLite.geoLocation(ipAddress);
    const osName = geoipLite.getOSFromUserAgent(userAgent);
    const deviceName = geoipLite.getDeviceFromUserAgent(userAgent);

    // Update click details
    await url.createRedirectLogs({
      urlId: cachedData._id,
      ipAddress,
      userAgent,
      osName,
      deviceName,
      geolocation: geolocation,
      userId: cachedData.userId,
    });

    await url.updateAnalyticsBreakdown({
      urlId: cachedData._id,
      osName,
      deviceName,
      userId: cachedData.userId,
    });

    return res.redirect(cachedData.longUrl);
  }
  const urlData = await url.findUrlByCustomAlias(alias);

  await client.setex(key, 60, JSON.stringify(urlData));

  if (!urlData) {
    return res.status(responseMessages.error.URL_NOT_FOUND.statusCode).json({
      message: responseMessages.error.URL_NOT_FOUND.message,
    });
  }

  // Extract data
  const userAgent = req.headers["user-agent"];
  const ipAddress = SECREATS.IP_ADDRESS||req.ip;
  const geolocation = geoipLite.geoLocation(ipAddress);
  const osName = geoipLite.getOSFromUserAgent(userAgent);
  const deviceName = geoipLite.getDeviceFromUserAgent(userAgent);

  // Update click details
  await url.createRedirectLogs({
    urlId: urlData._id,
    ipAddress,
    userAgent,
    osName,
    deviceName,
    geolocation: geolocation,
    userId: urlData.userId,
  });

  await url.updateAnalyticsBreakdown({
    urlId: urlData._id,
    osName,
    deviceName,
    userId: urlData.userId,
  });

  return res.redirect(urlData.longUrl);
};

export const getUrlAnalytics = async (req, res) => {
  const { alias } = req.params;
  const key = req.originalUrl;

  const data = await client.get(key);
  const cachedData = await JSON.parse(data);

  if (cachedData) {
    return res.json(cachedData);
  }

  const analytics = await url.findUrlAnalytics(alias);

  if (!analytics) {
    return res
      .status(responseMessages.error.ANALYTICS_NOT_FOUND.statusCode)
      .json({ message: responseMessages.error.ANALYTICS_NOT_FOUND.message });
  }
  await client.setex(key, 60, JSON.stringify(analytics));

  return res.json(analytics);
};

export const getUrlAnalyticsByTopic = async (req, res) => {
  const { topic } = req.params;
  const key = req.originalUrl;

  const data = await client.get(key);
  const cachedData = await JSON.parse(data);

  if (cachedData) {
    return res.json(cachedData);
  }

  const analytics = await url.findUrlAnalyticsByTopic(topic);

  if (!analytics) {
    return res
      .status(responseMessages.error.ANALYTICS_NOT_FOUND.statusCode)
      .json({ message: responseMessages.error.ANALYTICS_NOT_FOUND.message });
  }
  await client.setex(key, 60, JSON.stringify(analytics));

  return res.json(analytics);
};

export const getOverallAnalyticsOfUrlsByUser = async (req, res) => {
  const { userId } = req.user;
  const key = req.originalUrl;

  const data = await client.get(key);
  const cachedData = await JSON.parse(data);

  if (cachedData) {
    return res.json(cachedData);
  }

  const analytics = await url.findOverallAnalytics(userId);

  if (!analytics) {
    return res
      .status(responseMessages.error.ANALYTICS_NOT_FOUND.statusCode)
      .json({ message: responseMessages.error.ANALYTICS_NOT_FOUND.message });
  }

  // Flatten and summarize clicksByDate, osType, and deviceType
  const clicksByDate = {};
  const osSummary = {};
  const deviceSummary = {};

  analytics.clicksByDate.flat().forEach(({ date, clickCount }) => {
    if (date && clickCount) {
      clicksByDate[date] = (clicksByDate[date] || 0) + clickCount;
    }
  });

  analytics.osType.flat().forEach(({ osName, uniqueClicks, uniqueUsers }) => {
    if (osName) {
      if (!osSummary[osName])
        osSummary[osName] = { uniqueClicks: 0, uniqueUsers: 0 };
      osSummary[osName].uniqueClicks += uniqueClicks || 0;
      osSummary[osName].uniqueUsers += uniqueUsers || 0;
    }
  });

  analytics.deviceType
    .flat()
    .forEach(({ deviceName, uniqueClicks, uniqueUsers }) => {
      if (deviceName) {
        if (!deviceSummary[deviceName])
          deviceSummary[deviceName] = { uniqueClicks: 0, uniqueUsers: 0 };
        deviceSummary[deviceName].uniqueClicks += uniqueClicks || 0;
        deviceSummary[deviceName].uniqueUsers += uniqueUsers || 0;
      }
    });

  const analyticsData = {
    totalUrls: analytics.totalUrls,
    totalClicks: analytics.totalClicks,
    uniqueUsers: analytics.uniqueUsers,
    clicksByDate: Object.entries(clicksByDate).map(([date, clickCount]) => ({
      date,
      clickCount,
    })),
    osType: Object.entries(osSummary).map(
      ([osName, { uniqueClicks, uniqueUsers }]) => ({
        osName,
        uniqueClicks,
        uniqueUsers,
      })
    ),
    deviceType: Object.entries(deviceSummary).map(
      ([deviceName, { uniqueClicks, uniqueUsers }]) => ({
        deviceName,
        uniqueClicks,
        uniqueUsers,
      })
    ),
  };

  await client.setex(key, 60, JSON.stringify(analyticsData));

  return res.json(analyticsData);
};
