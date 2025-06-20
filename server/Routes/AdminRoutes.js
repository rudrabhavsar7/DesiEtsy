import express from "express";
import {
  login,
  logout,
  isAuth,
  getArtisans,
  verifyArtisan,
} from "../controllers/AdminController.js";
import { authAdmin } from "../middleware/adminAuth.js";
import {
  createCategory,
  createSubcategory,
  deleteCategory,
  getAllCategories,
  getAllSubcategories,
} from "../controllers/CategoryController.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/is-auth", authAdmin, isAuth);
router.get("/artisans", authAdmin, getArtisans);
router.put("/verify", authAdmin, verifyArtisan);
router.post(
  "/categories/add",
  authAdmin,
  upload.single("image"),
  createCategory
);
router.post(
  "/subcategories/add",
  authAdmin,
  upload.single("image"),
  createSubcategory
);
router.get("/categories", getAllCategories);
router.get("/subcategories", getAllSubcategories);
router.delete("/categories/:categoryId", authAdmin, deleteCategory);

export default router;
