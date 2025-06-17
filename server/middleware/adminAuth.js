import jwt from 'jsonwebtoken';

export const authAdmin = (req, res, next) => {
  try {
    const token = req.cookies.adminToken;
    
    if (!token) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }
    
    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    console.error("Admin auth middleware error:", error);
    return res.status(401).json({ success: false, error: "Authentication failed" });
  }
};