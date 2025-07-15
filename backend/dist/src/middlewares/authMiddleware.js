import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
        return res.status(401).json({ error: "Access token is missing or invalid" });
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err)
            return res.status(403).json({ error: "Invalid token" });
        const userPayload = payload;
        req.userEmail = userPayload.email;
        next();
    });
};
