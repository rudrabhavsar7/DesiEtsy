import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    images: { type: Array, required: true },
    description: { type: Array, required: true },
    sizes:{
        type: [
            { size: String, quantity: Number  }
        ],
        default:[]
    },
    quantity: { type: Number },
    inStock: { type: Boolean, required: true, default: true },
    status: { type: String, default: "pending" },
    notes:{ type: String, default: "" },
    artisanId: { type: String, required: true, ref: "Artisan" },

},{timestamps: true});

const Product = mongoose.model("Product", productSchema);

export default Product;