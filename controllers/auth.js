import { auth } from "../services/index.js";
import { responseMessages } from "../config/index.js";
import { jwt } from "../utils/index.js";
export const registerUser = async (req, res) => {
  const user = req?.user;

  if (!user) {
    return res
      .status(responseMessages.error.USER_REGISTERED_FAILED.statusCode)
      .json({ message: responseMessages.error.USER_REGISTERED_FAILED.message });
  }

  const token = jwt.generateToken({
    id: user._id,
    email: user.email,
  });

  res.status(responseMessages.success.USER_REGISTERED.statusCode).json({
    message: responseMessages.success.USER_REGISTERED.message,
    token,
  });
};
