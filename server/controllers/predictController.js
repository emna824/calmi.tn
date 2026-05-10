import mongoose from "mongoose";
import TestResult from "../models/TestResult.js";
import { runPrediction } from "../services/mlService.js";

function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

async function saveResult(userInputs, prediction) {
  if (mongoose.connection.readyState !== 1) {
    return;
  }

  await TestResult.create({
    userInputs,
    classification: prediction.classification,
    severity: prediction.severity,
    recommendations: prediction.recommendations || [],
    cluster: prediction.cluster
  });
}

export const predictClassification = asyncHandler(async (req, res) => {
  const result = await runPrediction("classification", req.body);
  res.json(result);
});

export const predictSeverity = asyncHandler(async (req, res) => {
  const result = await runPrediction("severity", req.body);
  res.json(result);
});

export const predictRecommendation = asyncHandler(async (req, res) => {
  const result = await runPrediction("recommendation", req.body);
  res.json(result);
});

export const predictClustering = asyncHandler(async (req, res) => {
  const result = await runPrediction("clustering", req.body);
  res.json(result);
});

export const predictFull = asyncHandler(async (req, res) => {
  const result = await runPrediction("full", req.body);
  await saveResult(req.body, result);
  res.json(result);
});

