import jwt from "jsonwebtoken";

export const authArtisan = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.ArtisanId) {
      req.ArtisanId = decoded.ArtisanId;
    } else {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: error.message });
  }
};
