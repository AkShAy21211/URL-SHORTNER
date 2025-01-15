import express from "express";
import passport from "passport";
import { auth } from "../controllers/index.js";

const router = express.Router();

// Google Register Route
router.get(
  "/google/register",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "register",
  })
);

// Google Login Route
router.get(
  "/google/login",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "login",
  })
);

// Google Callback Route (Single callback)
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const { state } = req.query;

    if (state === "register") {
      auth.registerUser(req,res)
    } else {
      auth.loginUser(req,res)
    }
  }
);

export default router;
