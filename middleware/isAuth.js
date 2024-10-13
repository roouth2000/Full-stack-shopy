import jwt from "jsonwebtoken";
import User from "../Models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(403).json({ message: "Authorization token missing" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id); // Add the decoded token data to req.user
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
export default isAuth;