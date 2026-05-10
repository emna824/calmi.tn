"""CLI prediction entrypoint for Calmi.tn.

Usage:
    python predict.py '{"Age":25,"Stress Level":"High"}'
    python predict.py full '{"Age":25,"Stress Level":"High"}'
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

import numpy as np

from preprocess import build_scaled_frame, load_artifact, load_metadata

BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"
MESSAGE = "Résultat indicatif, non médical."


def required_models_exist() -> bool:
    required = [
        "classification_model.pkl",
        "severity_model.pkl",
        "clustering_model.pkl",
        "recommendation_model.pkl",
        "scaler.pkl",
        "encoder.pkl",
    ]
    return all((MODELS_DIR / filename).exists() for filename in required)


def try_auto_train() -> None:
    """Train automatically if the CSV exists near the project and artifacts are missing."""

    if required_models_exist():
        return

    try:
        from train_from_notebook import train

        train()
    except Exception as error:  # pragma: no cover - fallback keeps the API usable
        print(f"Auto-training skipped: {error}", file=sys.stderr)


def score_level(value: str | None) -> int:
    mapping = {"Low": 0, "Moderate": 1, "Average": 1, "Good": 0, "High": 2, "Poor": 2, "Yes": 1, "No": 0}
    return mapping.get(str(value), 1)


def number(payload: dict[str, Any], key: str, default: float) -> float:
    try:
        return float(payload.get(key, default))
    except (TypeError, ValueError):
        return default


def heuristic_result(payload: dict[str, Any], mode: str = "full") -> dict[str, Any]:
    """Medical-safe fallback when trained models are not available yet."""

    anxiety = number(payload, "Anxiety Score", 5)
    panic = number(payload, "Panic Score", 4)
    depression = number(payload, "Depression Score", 4)
    heart_rate = number(payload, "Heart Rate", 75)
    stress = score_level(payload.get("Stress Level"))
    sleep = score_level(payload.get("Sleep Quality"))
    work = score_level(payload.get("Work Pressure"))
    caffeine = score_level(payload.get("Caffeine Intake"))
    activity = score_level(payload.get("Physical Activity"))
    support = score_level(payload.get("Social Support"))

    risk = (
        anxiety * 0.24
        + panic * 0.27
        + depression * 0.12
        + stress * 0.85
        + sleep * 0.55
        + work * 0.45
        + caffeine * 0.22
        + max(0, heart_rate - 80) * 0.025
        - activity * 0.28
        - support * 0.24
    )

    classification = "Panic Disorder" if risk >= 5.2 else "No Panic Disorder"

    if risk < 3.3:
        severity = "Low"
        cluster = "Profil stable"
    elif risk < 5.2:
        severity = "Medium"
        cluster = "Profil anxieux modéré"
    elif risk < 7.1:
        severity = "High"
        cluster = "Profil anxieux élevé"
    else:
        severity = "Severe"
        cluster = "Profil anxieux élevé"

    recommendations = build_recommendations(payload, severity)
    result = {
        "classification": classification,
        "severity": severity,
        "recommendations": recommendations,
        "cluster": cluster,
        "message": MESSAGE,
        "modelStatus": "fallback_without_trained_pkl",
    }
    return filter_mode(result, mode)


def build_recommendations(payload: dict[str, Any], severity: str) -> list[str]:
    recommendations: list[str] = []

    if score_level(payload.get("Stress Level")) >= 1:
        recommendations.append("Respiration guidée")
    if score_level(payload.get("Sleep Quality")) >= 1:
        recommendations.append("Routine de sommeil régulière")
    if score_level(payload.get("Physical Activity")) == 0:
        recommendations.append("Activité physique douce")
    if score_level(payload.get("Caffeine Intake")) == 2:
        recommendations.append("Réduire la consommation de caféine")
    if score_level(payload.get("Social Support")) == 0:
        recommendations.append("Renforcer le soutien social")
    if severity in {"High", "Severe"} or score_level(payload.get("Therapy History")) == 0:
        recommendations.append("Suivi psychologique")

    if not recommendations:
        recommendations.append("Maintenir les habitudes protectrices")

    return recommendations[:5]


def decode_severity(value: Any, metadata: dict[str, Any]) -> str:
    classes = metadata.get("label_classes", {}).get("severity", ["Low", "Medium", "High", "Severe"])
    try:
        index = int(value)
        if 0 <= index < len(classes):
            label = str(classes[index])
        else:
            label = str(value)
    except (TypeError, ValueError):
        label = str(value)

    normalized = {
        "Moderate": "Medium",
        "Mild": "Low",
    }
    return normalized.get(label, label)


def cluster_label(cluster: Any, metadata: dict[str, Any]) -> str:
    labels = metadata.get("label_classes", {}).get("clusters", {})
    return labels.get(str(int(cluster)), f"Profil similaire {cluster}")


def recommendations_from_neighbors(bundle: dict[str, Any], indices: np.ndarray, payload: dict[str, Any], severity: str) -> list[str]:
    reference = bundle.get("reference")
    recommendations = build_recommendations(payload, severity)

    if reference is not None and len(indices):
        neighbors = reference.iloc[indices[0]]
        if "Sleep Quality" in neighbors and float(neighbors["Sleep Quality"].mean()) < 1:
            recommendations.append("Améliorer la qualité du sommeil")
        if "Physical Activity" in neighbors and float(neighbors["Physical Activity"].mean()) < 1:
            recommendations.append("Augmenter l'activité physique")
        if "Caffeine Intake" in neighbors and float(neighbors["Caffeine Intake"].mean()) > 1:
            recommendations.append("Réduire la consommation de caféine")
        if "Social Support" in neighbors and float(neighbors["Social Support"].mean()) < 1:
            recommendations.append("Renforcer le support social")

    seen: set[str] = set()
    unique = []
    for recommendation in recommendations:
        if recommendation not in seen:
            unique.append(recommendation)
            seen.add(recommendation)
    return unique[:5]


def predict_with_models(payload: dict[str, Any], mode: str = "full") -> dict[str, Any]:
    metadata = load_metadata()
    scaled = build_scaled_frame(payload, metadata)

    classification_model = load_artifact("classification_model.pkl")
    severity_model = load_artifact("severity_model.pkl")
    clustering_model = load_artifact("clustering_model.pkl")
    recommendation_bundle = load_artifact("recommendation_model.pkl")

    if not all([classification_model, severity_model, clustering_model, recommendation_bundle]):
        return heuristic_result(payload, mode)

    feature_columns = metadata["feature_columns"]
    classification_raw = classification_model.predict(scaled[feature_columns])[0]
    classification = "Panic Disorder" if int(classification_raw) == 1 else "No Panic Disorder"

    severity_raw = severity_model.predict(scaled[feature_columns])[0]
    severity = decode_severity(severity_raw, metadata)

    cluster_features = metadata.get("cluster_features", [])
    cluster_raw = clustering_model.predict(scaled[cluster_features])[0]
    cluster = cluster_label(cluster_raw, metadata)

    recommendation_model = recommendation_bundle.get("model")
    recommendation_features = recommendation_bundle.get("features", metadata.get("recommendation_features", []))
    _, indices = recommendation_model.kneighbors(scaled[recommendation_features])
    recommendations = recommendations_from_neighbors(recommendation_bundle, indices, payload, severity)

    result = {
        "classification": classification,
        "severity": severity,
        "recommendations": recommendations,
        "cluster": cluster,
        "message": MESSAGE,
        "modelStatus": "trained_pkl",
    }
    return filter_mode(result, mode)


def filter_mode(result: dict[str, Any], mode: str) -> dict[str, Any]:
    if mode == "classification":
        return {"classification": result["classification"], "message": MESSAGE, "modelStatus": result.get("modelStatus")}
    if mode == "severity":
        return {"severity": result["severity"], "message": MESSAGE, "modelStatus": result.get("modelStatus")}
    if mode == "recommendation":
        return {"recommendations": result["recommendations"], "message": MESSAGE, "modelStatus": result.get("modelStatus")}
    if mode == "clustering":
        return {"cluster": result["cluster"], "message": MESSAGE, "modelStatus": result.get("modelStatus")}
    return result


def parse_payload(raw_payload: str) -> dict[str, Any]:
    try:
        return json.loads(raw_payload)
    except json.JSONDecodeError:
        return parse_lenient_payload(raw_payload)


def parse_lenient_payload(raw_payload: str) -> dict[str, Any]:
    """Accept PowerShell-stripped JSON such as {Age:25,Stress Level:High}."""

    payload = raw_payload.strip()
    if payload.startswith("{") and payload.endswith("}"):
        payload = payload[1:-1]

    parsed: dict[str, Any] = {}
    for part in re.split(r"\s*,\s*", payload):
        if ":" not in part:
            continue
        key, value = part.split(":", 1)
        key = key.strip().strip("\"'")
        value = value.strip().strip("\"'")
        if not key:
            continue
        try:
            parsed[key] = float(value) if "." in value else int(value)
        except ValueError:
            parsed[key] = value
    return parsed


def parse_args(argv: list[str]) -> tuple[str, dict[str, Any]]:
    if len(argv) < 2:
        return "full", {}

    if argv[1].strip().startswith("{"):
        return "full", parse_payload(" ".join(argv[1:]))

    mode = argv[1]
    payload = parse_payload(" ".join(argv[2:])) if len(argv) > 2 else {}
    return mode, payload


def main() -> None:
    mode, payload = parse_args(sys.argv)
    try_auto_train()
    if required_models_exist():
        result = predict_with_models(payload, mode)
    else:
        result = heuristic_result(payload, mode)

    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
