import jwt from "jsonwebtoken";
import User from "../models/User.js"; // adjust path to your User model

// Middleware to protect routes
export const protectRoute = async (req, res, next) => {
  try {
    // ✅ Read token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Find user and exclude password
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ success: false, message: "Unauthorized: " + error.message });
  }
};
