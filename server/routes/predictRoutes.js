import { Router } from "express";
import {
  predictClassification,
  predictClustering,
  predictFull,
  predictRecommendation,
  predictSeverity
} from "../controllers/predictController.js";

const router = Router();

router.post("/classification", predictClassification);
router.post("/severity", predictSeverity);
router.post("/recommendation", predictRecommendation);
router.post("/clustering", predictClustering);
router.post("/full", predictFull);

export default router;

