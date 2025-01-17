import { url } from "../services/index.js";
import { createUniqueId, geoipLite } from "../utils/index.js";
import { logger, responseMessages } from "../config/index.js";
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

  const urlData = await url.findUrlByCustomAlias(alias);

  if (!urlData) {
    return res.status(responseMessages.error.URL_NOT_FOUND.statusCode).json({
      message: responseMessages.error.URL_NOT_FOUND.message,
    });
  }

  // Extract data
  const userAgent = req.headers["user-agent"];
  const ipAddress = SECREATS.IP_ADDRESS;
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

  res.redirect(urlData.longUrl);
};

export const getUrlAnalytics = async (req, res) => {
  const { alias } = req.params;

  const urlData = await url.findUrlByCustomAlias(alias);

  if (!urlData) {
    return res.status(responseMessages.error.URL_NOT_FOUND.statusCode).json({
      message: responseMessages.error.URL_NOT_FOUND.message,
    });
  }

  const analytics = await url.findUrlAnalytics(urlData._id);

  if (!analytics) {
    return res
      .status(responseMessages.error.ANALYTICS_NOT_FOUND.statusCode)
      .json({ message: responseMessages.error.ANALYTICS_NOT_FOUND.message });
  }

  return res.json(analytics);
};
