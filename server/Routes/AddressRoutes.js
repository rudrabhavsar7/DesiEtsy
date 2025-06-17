import express from "express"
import {authUser} from "../middleware/userAuth.js"
import { addAddress, getAddress } from '../controllers/AddressController.js'

const addressRouter = express.Router();

addressRouter.post('/add', authUser,addAddress);
addressRouter.get('/get', authUser,getAddress);

export default addressRouter;
