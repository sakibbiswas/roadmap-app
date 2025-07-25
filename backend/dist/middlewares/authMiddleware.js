"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
        return res.status(401).json({ error: "Access token is missing or invalid" });
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err)
            return res.status(403).json({ error: "Invalid token" });
        const userPayload = payload;
        req.userEmail = userPayload.email;
        next();
    });
};
exports.authenticateToken = authenticateToken;
