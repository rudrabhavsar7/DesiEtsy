import { isAuth, login, logout, register } from "../controllers/ArtisanController.js";
import { addProduct, deleteProduct, editProduct, getProducts } from "../controllers/ProductController.js";
import { authArtisan } from "../middleware/artisanAuth.js";
import Artisan from "../models/Artisan.js";
import upload from "../config/multer.js";

import express from "express";
import { getOrdersByArtisanId } from "../controllers/CartController.js";

const router = express.Router();

router.post('/register',register);
router.post('/login', login);
router.get('/is-auth',authArtisan,isAuth);
router.post('/logout',logout);

router.post('/products/add',upload.array(["images"]), authArtisan, addProduct);
router.get('/products', getProducts);
router.delete('/products/delete/:productId', authArtisan, deleteProduct);
router.put('/products/update/:productId', authArtisan, upload.array(["images"]), editProduct);

router.get('/orders',authArtisan, getOrdersByArtisanId);

export default router;