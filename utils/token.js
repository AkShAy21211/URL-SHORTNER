import jwt from "jsonwebtoken";
import { SECREATS } from "../config/index.js";

// Create a new token

export const generateToken = (user) => {
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    SECREATS.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return token;
};



export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECREATS.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};
