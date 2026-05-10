"""Preprocessing helpers reused by training and prediction."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import joblib
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"
METADATA_PATH = MODELS_DIR / "model_metadata.json"


def load_metadata() -> dict[str, Any]:
    with METADATA_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def load_artifact(filename: str) -> Any | None:
    path = MODELS_DIR / filename
    if not path.exists():
        return None
    return joblib.load(path)


def _is_missing(value: Any) -> bool:
    return value is None or value == "" or str(value).lower() in {"nan", "none", "null"}


def _numeric_value(value: Any, default: float) -> float:
    if _is_missing(value):
        return float(default)
    try:
        return float(value)
    except (TypeError, ValueError):
        return float(default)


def _encode_with_label_encoder(value: Any, encoder: Any, default_value: Any) -> int:
    raw_value = default_value if _is_missing(value) else value
    raw_value = str(raw_value)
    classes = [str(item) for item in getattr(encoder, "classes_", [])]

    if raw_value in classes:
        return int(encoder.transform([raw_value])[0])

    if str(default_value) in classes:
        return int(encoder.transform([str(default_value)])[0])

    return 0


def _encode_from_metadata(value: Any, options: list[str], default_value: str) -> int:
    raw_value = default_value if _is_missing(value) else str(value)
    if raw_value in options:
        return options.index(raw_value)
    if default_value in options:
        return options.index(default_value)
    return 0


def build_encoded_frame(payload: dict[str, Any], metadata: dict[str, Any] | None = None) -> pd.DataFrame:
    """Build a one-row encoded DataFrame in the exact feature order used by the models."""

    metadata = metadata or load_metadata()
    encoders = load_artifact("encoder.pkl") or {}
    numeric_defaults = metadata.get("imputation", {}).get("numeric", {})
    categorical_defaults = metadata.get("imputation", {}).get("categorical", {})
    category_options = metadata.get("category_options", {})
    row: dict[str, float | int] = {}

    for column in metadata["feature_columns"]:
        if column in metadata.get("numeric_columns", []):
            row[column] = _numeric_value(payload.get(column), numeric_defaults.get(column, 0))
            continue

        default_value = categorical_defaults.get(column, "")
        if column in encoders:
            row[column] = _encode_with_label_encoder(payload.get(column), encoders[column], default_value)
        else:
            row[column] = _encode_from_metadata(payload.get(column), category_options.get(column, []), default_value)

    return pd.DataFrame([row], columns=metadata["feature_columns"])


def build_scaled_frame(payload: dict[str, Any], metadata: dict[str, Any] | None = None) -> pd.DataFrame:
    """Apply the saved scaler when available; otherwise return encoded values for fallback mode."""

    metadata = metadata or load_metadata()
    encoded = build_encoded_frame(payload, metadata)
    scaler = load_artifact("scaler.pkl")

    if scaler is None:
        return encoded

    scaled_values = scaler.transform(encoded[metadata["feature_columns"]])
    return pd.DataFrame(scaled_values, columns=metadata["feature_columns"])

