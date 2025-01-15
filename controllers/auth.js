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

  const existingUser = await auth.findUserByGoogleId(user.googleId);

  if (existingUser) {
    return res
      .status(responseMessages.error.USER_EXISTS.statusCode)
      .json({ message: responseMessages.error.USER_EXISTS.message });
  }

  const token = jwt.generateToken({
    id: user._id,
    email: user.email,
  });

  const newUser = await auth.createUser({
    email: user.email,
    name: user.name,
    googleId: user.googleId,
    profilePicture: user.profilePicture,
  });

  if (newUser) {
    return res
      .status(responseMessages.success.USER_REGISTERED.statusCode)
      .json({
        message: responseMessages.success.USER_REGISTERED.message,
        token,
      });
  }

  return res
    .status(responseMessages.error.USER_REGISTERED_FAILED.statusCode)
    .json({ message: responseMessages.error.USER_REGISTERED_FAILED.message });
};

export const loginUser = async (req, res) => {
  const user = req?.user;

  console.log("loginUser", user);
  
  if (!user) {
    return res
      .status(responseMessages.error.LOGIN_FAILED.status)
      .json({ message: responseMessages.error.LOGIN_FAILED.message });
  }

  const existingUser = await auth.findUserByGoogleId(user.googleId);

  if (!existingUser) {
    return res
      .status(responseMessages.error.USER_NOT_FOUND.statusCode)
      .json({ message: responseMessages.error.USER_NOT_FOUND.message });
  }

  const token = jwt.generateToken({
    id: user._id,
    email: user.email,
  });

  return res.status(responseMessages.success.LOGIN_SUCCESS.statusCode).json({
    message: responseMessages.success.LOGIN_SUCCESS.message,
    token,
  });
};
