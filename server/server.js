import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from 'dotenv'
dotenv.config();
import cookieParser from "cookie-parser";
import userRouter from './Routes/UserRoutes.js'
import addressRouter from "./Routes/AddressRoutes.js";
import cartRouter from "./Routes/CartRoutes.js";
import artisanRouter from "./Routes/ArtisanRoute.js";
import adminRouter from "./Routes/AdminRoutes.js";
import passport from 'passport';
import './config/passport.js'; 

const app = express();

app.use(express.json());
app.use(cors({origin:'https://desietsy.vercel.app',
    credentials: true,
}));
app.use(cookieParser());

app.use(passport.initialize());
app.use('/api/user',userRouter);
app.use('/api/address', addressRouter);
app.use('/api/cart', cartRouter);
app.use('/api/artisan', artisanRouter);
app.use('/api/admin', adminRouter);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})