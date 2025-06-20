import Artisan from "../models/Artisan.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      id,
      street,
      city,
      state,
      country,
      zipCode,
    } = req.body;

    console.log({ name, email, password, phone, id, street, city, state, country, zipCode });

    // Check if email already exists
    const existingArtisan = await Artisan.findOne({ email });

    if (existingArtisan) {
      if (existingArtisan.isVerified) {
        return res
          .status(400)
          .json({message: "Email already exists and is verified" });
      } else {
        return res
          .status(400)
          .json({success:false, message: "Email already exists but not verified" });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new artisan
    const artisan = new Artisan({
      name,
      email,
      password: hashedPassword,
      phone,
      Id:id,
      address: {
        street,
        city,
        state,
        country,
        zipCode,
      },
    });

    await artisan.save();

    console.log("Artisan created:", artisan);

    // Generate JWT token
    const token = jwt.sign(
      { ArtisanId: artisan._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({success:true, message: "Artisan registered successfully",artisan });

  } catch (error) { 
    res.status(500).json({ success:false, error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log({ email, password });

    // Find artisan by email
    const artisan = await Artisan.findOne({ email });
    if (!artisan) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, artisan.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { ArtisanId: artisan._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, message: "Login successful", artisan });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const isAuth = async (req, res) => {
  try {
    const ArtisanId = req.ArtisanId
    const artisan = await Artisan.findById(ArtisanId).select("-password");
    return res.json({ success: true, artisan });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production"? "none" : "strict",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}