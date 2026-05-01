import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
    try {
        let token;

        // 1️⃣ Check header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        // 2️⃣ No token
        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Not authorized, no token",
                statusCode: 401,
            });
        }

        // 3️⃣ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4️⃣ Get user
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                error: "User not found",
                statusCode: 401,
            });
        }

        // 5️⃣ Attach user
        req.user = user;

        next();

    } catch (error) {
        console.error("Auth middleware error:", error);

        return res.status(401).json({
            success: false,
            error: "Not authorized, token failed",
            statusCode: 401,
        });
    }
};

export default protect;