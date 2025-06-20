import { Category,Subcategory } from "../models/Category.js";
import upload from "../config/multer.js";
import cloudinary from "../config/cloudinary.js";
import e from "express";

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json({success:true,categories});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};

export const getSubcategoriesByCategoryId = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const subcategories = await Subcategory.find({ categoryId });
        res.json(subcategories);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};

export const getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find();
    res.json({ success: true, subcategories });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}; 

export const createCategory = async (req, res) => {
  try {
    const { title, path, tagline } = req.body;
    const imageFile = req.file.path;

    console.log({ title, path, tagline });

    if (!imageFile) {
      return res.status(400).json({ message: "Image is required" });
    }

    let result;
    // Upload to Cloudinary
    try {
      result = await cloudinary.uploader.upload(imageFile,
        { folder: "DesiEtsy/categories" });
    } catch (error) {
      return res.status(500).json({ message: "Cloudinary upload failed" });
    }

    const category = new Category({
      title,
      path,
      tagline,
      image: result.secure_url,
    });

    console.log(category);
    await category.save();
    res.status(201).json({ success: true, category });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createSubcategory = async (req, res) => {
  try {
    const { title, path, category } = req.body;
    const imageFile = req.file.path;
    console.log({ title, path, category });
    if (!imageFile) {
      return res.status(400).json({ message: "Image is required" });
    }
    let result;
    // Upload to Cloudinary
    try {
      result = await cloudinary.uploader.upload(imageFile, {
        folder: "DesiEtsy/subcategories",
      });
    } catch (error) {
      return res.status(500).json({ message: "Cloudinary upload failed" });
    }

    const categoryPath = await Category.findOne({title:category});
    console.log(categoryPath.path);

    const subcategory = new Subcategory({
      title,
      path,
      category:categoryPath.path,
      image: result.secure_url,
    });
    console.log(subcategory);
    await subcategory.save();
    res.status(201).json({ success: true, subcategory });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    await Category.findByIdAndDelete(categoryId);
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

