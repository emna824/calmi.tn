import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import predictRoutes from "./routes/predictRoutes.js";

dotenv.config();

const app = express();

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json({ limit: "1mb" }));

/*
|--------------------------------------------------------------------------
| MongoDB
|--------------------------------------------------------------------------
*/

if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((error) =>
      console.warn("MongoDB connection skipped:", error.message)
    );
} else {
  console.warn("MONGODB_URI is not set. Predictions will not be persisted.");
}

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/", (_req, res) => {
  res.json({
    message: "API working"
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Calmi.tn API"
  });
});

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

app.use("/api/predict", predictRoutes);

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/

app.use((error, _req, res, _next) => {
  console.error("SERVER ERROR:");
  console.error(error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Erreur serveur",
    details: error.details || null,
    stack:
      process.env.NODE_ENV === "development"
        ? error.stack
        : undefined
  });
});

/*
|--------------------------------------------------------------------------
| Export App For Vercel
|--------------------------------------------------------------------------
*/

export default app;