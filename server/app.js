import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import predictRoutes from "./routes/predictRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.warn("MongoDB connection skipped:", error.message));
} else {
  console.warn("MONGODB_URI is not set. Predictions will not be persisted.");
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Calmi.tn API" });
});

app.use("/api/predict", predictRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || "Erreur serveur",
    details: error.details
  });
});

app.listen(port, () => {
  console.log(`Calmi.tn API running on http://localhost:${port}`);
});

