// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import mongoose from "mongoose";

// import authRoutes from "./routes/auth";
// import roadmapRoutes from "./routes/roadmap";
// import commentRoutes from "./routes/comment";

// dotenv.config();

// const app = express();

// app.use(cors());




// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("API is running...");
// });
// mongoose
//   .connect(process.env.MONGO_URI!)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//     process.exit(1);
//   });

// app.use("/api/auth", authRoutes);
// app.use("/api/roadmaps", roadmapRoutes);
// app.use("/api/comments", commentRoutes);

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({ error: "Route not found" });
// });

// export default app;











import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

import authRoutes from "./routes/auth";
import roadmapRoutes from "./routes/roadmap";
import commentRoutes from "./routes/comment";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/comments", commentRoutes);

// Serve frontend static files (production)
app.use(express.static(path.join(__dirname, "../frontend/roadmap-app/dist")));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Serve React frontend for all unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/roadmap-app/dist/index.html"));
});

// 404 handler (optional override)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
