import { isAuth, login, logout, register } from "../controllers/ArtisanController.js";
import { authArtisan } from "../middleware/artisanAuth.js";
import Artisan from "../models/Artisan.js";

import express from "express";

const router = express.Router();

router.post('/register',register);
router.post('/login', login);
router.get('/is-auth',authArtisan,isAuth);
router.post('/logout',logout);

export default router;