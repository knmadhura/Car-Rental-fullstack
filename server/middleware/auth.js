import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not authorized, token missing" });
  }

  const token = authHeader.split(" ")[1]; // extract token from "Bearer <token>"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user; // attach user document to request object
    next();

  } catch (error) {
    console.error("Protect middleware error:", error.message);
    return res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};
