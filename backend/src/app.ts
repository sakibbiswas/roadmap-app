import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth";
import roadmapRoutes from "./routes/roadmap";
import commentRoutes from "./routes/comment";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.use("/api/auth", authRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/comments", commentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;








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

