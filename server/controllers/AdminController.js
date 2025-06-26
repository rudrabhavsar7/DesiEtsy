import Admin from "../models/Admin.js";
import Artisan from "../models/Artisan.js";
import User from '../models/User.js';
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });

    console.log(admin);
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = password === admin.password ? true : false;
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    }

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    console.log("Admin token:", token);

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Admin logout error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const isAuth = async (req, res) => {
  try {
    const adminId = req.adminId;
    const admin = await Admin.findById(adminId).select("-password");

    if (!admin) {
      return res.status(401).json({ success: false, error: "Admin not found" });
    }

    return res.json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin auth check error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getArtisans = async (req, res) => {
  try {
    const artisans = await Artisan.find();
    res.json({ success: true, artisans });
  } catch (error) {
    console.error("Get artisans error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getUsers = async (req,res) => {
  try {
    const users = await User.find();
    res.json({success:true, users})

  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
}

export const verifyArtisan = async (req, res) => {
  try {
    const {artisanId,isVerified,comments} = req.body;
    console.log(artisanId, isVerified, comments);
    const artisan = await Artisan.findByIdAndUpdate(artisanId, {isVerified, comments, isRejected:!isVerified}, {new: true} );

    if (!artisan) {
      return res.status(404).json({ success: false, error: "Artisan not found" });
    }

    res.json({ success: true, artisan });
  } catch (error) {
    console.error("Get artisan by ID error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};