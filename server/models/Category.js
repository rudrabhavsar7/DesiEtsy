import mongoose from "mongoose";

const categoriesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    tagline: {
        type: String,
        required: true
    },
})

export const Category =  mongoose.model("Category", categoriesSchema);

const subcategoriesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Category"
    }
})

export const Subcategory =  mongoose.model("Subcategory", subcategoriesSchema);