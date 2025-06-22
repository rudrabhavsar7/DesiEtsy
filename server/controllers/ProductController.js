import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import { Subcategory } from "../models/Category.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      offerPrice,
      description,
      quantity,
      sizes,
      artisanId,
    } = req.body;
    const images = req.files;

    if (!name || !price || !description || !category || !artisanId) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    const categoryPath = await Subcategory.findOne({ title: category });

    console.log(categoryPath.title);

    const imagesUrls = await Promise.all(
      images.map(async (image) => {
        const result = await cloudinary.uploader.upload(image.path, {
          folder: "DesiEtsy/Products",
          resource_type: "image",
        });
        return result.secure_url;
      })
    );
    const newProduct = new Product({
      name,
      category: categoryPath.title,
      price,
      offerPrice,
      description,
      sizes: JSON.parse(sizes) || [],
      artisanId,
      quantity,
      images: imagesUrls,
    });

    console.log("new Product", newProduct);
    await newProduct.save();
    res.json({
      success: true,
      message: "Product added successfully",
      newProduct,
    });
  } catch (error) {}
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    console.log("productId", productId);
    if (!productId) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid product ID" });
    }
    await Product.findByIdAndDelete(productId);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const approveProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { notes, status } = req.body;
    console.log("productId", productId);
    console.log("notes", notes);
    console.log("status", status);
    if (!productId) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid product ID" });
    }
    const product = await Product.findByIdAndUpdate(
      productId,
      { notes, status },
      { new: true }
    );
    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }
    res.json({
      success: true,
      message: "Product approved successfully",
      product,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { inStock, quantity } = req.body;

    console.log("productId", productId);
    console.log("inStock", inStock);
    console.log("quantity", quantity);

    if (!productId) {
      return res
       .status(400)
       .json({ success: false, error: "Invalid product ID" });
    }
    const product = await Product.findByIdAndUpdate(
      productId,
      { inStock, quantity },
      { new: true }
    );

    console.log("product", product);
    if (!product) {
      return res
       .status(404)
       .json({ success: false, error: "Product not found" });
    }
    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const editProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, price, offerPrice, description, sizes, artisanId } = req.body;

    console.log(JSON.parse(description))
    const images = req.files;
    if (!productId) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid product ID" });
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        price,
        offerPrice,
        description: JSON.parse(description),
        sizes: JSON.parse(sizes) || [],
        artisanId,
      },
      { new: true }
    );
    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }
    if (images) {
      const imagesUrls = await Promise.all(
        images.map(async (image) => {
          const result = await cloudinary.uploader.upload(image.path, {
            folder: "DesiEtsy/Products",
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
      product.images = product.images.concat(imagesUrls);
      await product.save();
    }
    res.json({
      success: true,
      message: "Product edited successfully",
      product,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
}
