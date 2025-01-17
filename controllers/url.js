import { url } from "../services/index.js";
import { createUniqueId } from "../utils/index.js";
import { responseMessages } from "../config/index.js";
import { SECREATS } from "../config/index.js";

export const shortenUrl = async (req, res) => {
  const { longUrl } = req.body;
  const customAlias = req.body.customAlias || "";
  const topic = req.body.topic || "";
  const userId = req.user.userId;

  console.log(req.user);

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
    });
  }

  return res.status(responseMessages.error.URL_SHORTEN_FAILED.statusCode).json({
    message: responseMessages.error.URL_SHORTEN_FAILED.message,
  });
};
