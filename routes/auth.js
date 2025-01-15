import express from "express";
import { auth } from "../controllers/index.js";
import passport from "passport";


const router = express.Router();

// Routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  auth.registerUser
);

export default router