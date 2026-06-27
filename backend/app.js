import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./db.js";

dotenv.config();

const startServer = async () => {
  try {
    const db = await connectDB();

    const app = express();

    app.use(express.json());
    app.use(cookieParser());

    // ✅ CORS (critical for cookies)
    app.use(
      cors({
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        credentials: true,
      })
    );

    // Attach DB to each request
    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    // Routes
    app.use("/auth", authRoutes);
    app.use("/tasks", taskRoutes);
    app.use("/stats", statsRoutes);

    // Health check (optional but useful)
    app.get("/", (req, res) => {
      res.send("API is running...");
    });

    // Global error handler
    app.use((err, req, res, next) => {
      console.error("🔥 Server Error:", err.message);
      res.status(err.status || 500).json({ message: err.message || "Something went wrong!" });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.log("❌ Could not connect to database!");
    console.log(err);
  }
};

startServer();
