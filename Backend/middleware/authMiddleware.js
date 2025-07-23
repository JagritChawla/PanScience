import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protectRoute = async (req, res, next) => {

    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "No token provided, authorization denied" });
        }

    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Token is not valid" });
        }

        const user = await User.findById(decoded.id).select("-password");
        req.user = user;
        next();


    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: "Token is not valid" });
    }
};

export const adminRoute = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Access denied, admin only" });
    }
}