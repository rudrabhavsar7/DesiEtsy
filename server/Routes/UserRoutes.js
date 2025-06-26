import User from "../models/User.js";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  isAuth,
  login,
  logout,
  register,
} from "../controllers/UserController.js";
import { authUser } from "../middleware/userAuth.js";
import passport from "passport";

const router = express.Router();

// Register a new user

router.post("/register", register);
router.post("/login", login);
router.get("/is-auth", authUser, isAuth);
router.post("/logout", logout);

router.get(
  "/oauth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/oauth/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  (req, res) => {
    const { token } = req.user;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
    });
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  }
);

export default router;
