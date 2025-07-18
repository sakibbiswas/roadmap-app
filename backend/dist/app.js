"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const roadmap_1 = __importDefault(require("./routes/roadmap"));
const comment_1 = __importDefault(require("./routes/comment"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("API is running...");
});
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
});
app.use("/api/auth", auth_1.default);
app.use("/api/roadmaps", roadmap_1.default);
app.use("/api/comments", comment_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});
exports.default = app;
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import path from "path";
// import authRoutes from "./routes/auth";
// import roadmapRoutes from "./routes/roadmap";
// import commentRoutes from "./routes/comment";
// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());
// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI!)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//     process.exit(1);
//   });
// // API Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/roadmaps", roadmapRoutes);
// app.use("/api/comments", commentRoutes);
// // Serve frontend static files (production)
// app.use(express.static(path.join(__dirname, "../frontend/roadmap-app/dist")));
// app.get("/", (req, res) => {
//   res.send("API is running...");
// });
// // Serve React frontend for all unknown routes
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/roadmap-app/dist/index.html"));
// });
// // 404 handler (optional override)
// app.use((req, res) => {
//   res.status(404).json({ error: "Route not found" });
// });
// export default app;
