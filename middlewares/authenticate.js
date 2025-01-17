import { jwt } from "../utils/index.js";
import { responseMessages } from "../config/index.js";
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verifyToken(token);

    if (!decoded) {
      return res
        .status(responseMessages.error.AUTHENTICATION_FAILED.statusCode)
        .json({
          message: responseMessages.error.AUTHENTICATION_FAILED.message,
        });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res
      .status(responseMessages.error.SERVER_ERROR.statusCode)
      .json({ message: responseMessages.error.SERVER_ERROR.message });
  }
};

export default authenticate;
