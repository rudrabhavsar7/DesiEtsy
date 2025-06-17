import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from 'dotenv'
dotenv.config();
import cookieParser from "cookie-parser";
import userRouter from './Routes/UserRoutes.js'
import addressRouter from "./Routes/AddressRoutes.js";
import cartRouter from "./Routes/CartRoutes.js";
import artisanRouter from "./routes/ArtisanRoute.js";

const app = express();

app.use(express.json());
app.use(cors({origin:'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());


app.use('/api/user',userRouter);
app.use('/api/address', addressRouter);
app.use('/api/cart', cartRouter);
app.use('/api/artisan', artisanRouter);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})