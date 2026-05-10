import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scriptPath = path.resolve(__dirname, "../ml/predict.py");

export function runPrediction(mode, payload) {
  return new Promise((resolve, reject) => {
   /* const pythonBin = process.env.PYTHON_BIN || "python";
    const child = spawn(pythonBin, [scriptPath, mode, JSON.stringify(payload || {})], {
      cwd: path.dirname(scriptPath),
      windowsHide: true
    });
*/
export async function runPrediction(mode, payload) {
  try {
    const response = await fetch(process.env.PYTHON_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
              mode,
              payload: payload || {}
            })
    });

    if (!response.ok) {
      throw new Error("Python service error");
    }

    return await response.json();

  } catch (error) {
    throw {
      status: 500,
      message: "Python service unavailable",
      details: error.message
    };
  }
}
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      reject({
        status: 500,
        message: "Impossible de lancer le service Python.",
        details: error.message
      });
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject({
          status: 500,
          message: "Erreur pendant la prédiction ML.",
          details: stderr || stdout
        });
        return;
      }

      try {
        resolve(JSON.parse(stdout));
      } catch (error) {
        reject({
          status: 500,
          message: "Réponse Python invalide.",
          details: { stdout, stderr, parseError: error.message }
        });
      }
    });
  });
}

