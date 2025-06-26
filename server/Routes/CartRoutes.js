import express from "express";
import {authUser} from '../middleware/userAuth.js'
import { getOrdersById, placeOrderbyCash, placeOrderByStripe, updateCart } from '../controllers/CartController.js'

const cartRouter = express.Router();

cartRouter.post('/update',authUser,updateCart);
cartRouter.post('/order/cash',authUser,placeOrderbyCash);
cartRouter.post('order/online',authUser,placeOrderByStripe);
cartRouter.get('/orders',authUser,getOrdersById);

export default cartRouter;