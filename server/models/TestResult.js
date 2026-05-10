import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema(
  {
    userInputs: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    classification: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      required: true
    },
    recommendations: {
      type: [String],
      default: []
    },
    cluster: {
      type: String,
      required: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export default mongoose.model("TestResult", testResultSchema);

