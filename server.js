import express from "express";
import createError from "http-errors";
import dotenv from "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import { authRoute, urlRoute } from "./routes/index.js";
import "./config/db.js";
import "./config/passport.js";
import session from "express-session";
import { SECREATS, logger } from "./config/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  session({
    secret: SECREATS.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/url", urlRoute);
app.use("/", (req, res) => {
  res.send("API is running....");
});
// 404 Handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  logger.error(err);
  res.json({ message: err.message });
});

// Start Server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
