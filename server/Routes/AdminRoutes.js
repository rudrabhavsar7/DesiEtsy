import express from "express";
import { login, logout, isAuth } from "../controllers/AdminController.js";
import { authAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/is-auth", authAdmin, isAuth);

export default router;