import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    images: { type: Array, required: true },
    description: { type: Array, required: true },
    quantity: { type: Number, required: true },
    inStock: { type: Boolean, required: true },
},{timestamps: true});

export default Product = mongoose.model("Product", productSchema);