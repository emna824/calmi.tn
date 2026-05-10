import express from "express";
import cors from "cors";
import predictRoutes from "../routes/predictRoutes.js";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.options("*", cors());

app.use("/predict", predictRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API working" });
});

export default app;