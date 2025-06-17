import User from "../models/User.js";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {isAuth, login, logout, register } from "../controllers/UserController.js";
import { authUser } from "../middleware/userAuth.js";

const router = express.Router();

// Register a new user

router.post("/register", register);
router.post("/login",login);
router.get('/is-auth',authUser,isAuth);
router.post('/logout',logout);


export default router;
