"""Train and save Calmi.tn ML artifacts from the notebook dataset."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

import joblib
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score
from sklearn.model_selection import train_test_split
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import LabelEncoder, StandardScaler

try:
    from imblearn.over_sampling import SMOTE
except ImportError:  # pragma: no cover - optional fallback
    SMOTE = None

try:
    from xgboost import XGBClassifier
except ImportError:  # pragma: no cover - optional fallback
    XGBClassifier = None

BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parents[1]
WORKSPACE_DIR = BASE_DIR.parents[2]
MODELS_DIR = BASE_DIR / "models"
NOTEBOOK_PATH = WORKSPACE_DIR / "Untitled7.ipynb"

CLASSIFICATION_TARGET = "Panic Disorder Diagnosis"
SEVERITY_TARGET = "Severity"
DROP_COLUMNS = ["Participant ID"]
CLUSTER_FEATURES = ["Anxiety Score", "Depression Score", "Panic Score"]
RECOMMENDATION_FEATURES = [
    "Age",
    "Sleep Quality",
    "Stress Level",
    "Physical Activity",
    "Caffeine Intake",
    "Work Pressure",
    "Social Support",
    "Anxiety Score",
    "Depression Score",
]


def read_notebook_dataset_filename() -> str:
    """Extract the CSV filename referenced by Untitled7.ipynb."""

    if not NOTEBOOK_PATH.exists():
        return "panic_disorder_dataset_realistic.csv"

    notebook = json.loads(NOTEBOOK_PATH.read_text(encoding="utf-8"))
    code = "\n".join(
        "".join(cell.get("source", []))
        for cell in notebook.get("cells", [])
        if cell.get("cell_type") == "code"
    )
    match = re.search(r"read_csv\((?:r)?[\"']([^\"']+)[\"']", code)
    if not match:
        return "panic_disorder_dataset_realistic.csv"

    return Path(match.group(1)).name


def find_dataset(dataset_arg: str | None = None) -> Path:
    if dataset_arg:
        path = Path(dataset_arg).expanduser().resolve()
        if path.exists():
            return path
        raise FileNotFoundError(f"Dataset introuvable: {path}")

    filename = read_notebook_dataset_filename()
    candidates = [
        WORKSPACE_DIR / filename,
        PROJECT_DIR / filename,
        BASE_DIR / filename,
        BASE_DIR / "data" / filename,
    ]

    for candidate in candidates:
        if candidate.exists():
            return candidate

    searched = "\n".join(str(candidate) for candidate in candidates)
    raise FileNotFoundError(
        "Dataset introuvable. Placez le CSV du notebook dans l'un de ces chemins ou utilisez --dataset:\n"
        + searched
    )


def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df = df.drop(columns=[column for column in DROP_COLUMNS if column in df.columns], errors="ignore")

    categorical_columns = df.select_dtypes(include=["object", "string"]).columns.tolist()
    numeric_columns = df.select_dtypes(include=["int64", "float64", "int32", "float32"]).columns.tolist()

    for column in categorical_columns:
        mode = df[column].mode(dropna=True)
        fill_value = mode.iloc[0] if not mode.empty else "Unknown"
        df[column] = df[column].fillna(fill_value)

    for column in numeric_columns:
        df[column] = df[column].fillna(df[column].median())

    return df


def encode_dataframe(df: pd.DataFrame) -> tuple[pd.DataFrame, dict[str, LabelEncoder]]:
    encoded = df.copy()
    encoders: dict[str, LabelEncoder] = {}
    categorical_columns = encoded.select_dtypes(include=["object", "string"]).columns.tolist()

    for column in categorical_columns:
        encoder = LabelEncoder()
        encoded[column] = encoder.fit_transform(encoded[column].astype(str))
        encoders[column] = encoder

    return encoded, encoders


def train(dataset_arg: str | None = None) -> dict[str, Any]:
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    dataset_path = find_dataset(dataset_arg)
    df = pd.read_csv(dataset_path)
    df = clean_dataframe(df)

    if CLASSIFICATION_TARGET not in df.columns or SEVERITY_TARGET not in df.columns:
        raise ValueError("Le dataset doit contenir 'Panic Disorder Diagnosis' et 'Severity'.")

    df_encoded, encoders = encode_dataframe(df)
    feature_columns = [
        column
        for column in df_encoded.columns
        if column not in {CLASSIFICATION_TARGET, SEVERITY_TARGET}
    ]
    numeric_columns = [
        column
        for column in feature_columns
        if column not in encoders
    ]
    categorical_columns = [column for column in feature_columns if column in encoders]

    scaler = StandardScaler()
    df_scaled = df_encoded.copy()
    df_scaled[feature_columns] = scaler.fit_transform(df_encoded[feature_columns])

    X = df_scaled[feature_columns]
    y_classification = df_encoded[CLASSIFICATION_TARGET]
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y_classification,
        test_size=0.2,
        random_state=42,
        stratify=y_classification,
    )

    if SMOTE is not None:
        X_train, y_train = SMOTE(random_state=42).fit_resample(X_train, y_train)

    if XGBClassifier is not None:
        classification_model = XGBClassifier(
            random_state=42,
            n_estimators=100,
            max_depth=5,
            learning_rate=0.1,
            eval_metric="logloss",
        )
    else:
        classification_model = RandomForestClassifier(n_estimators=160, random_state=42, class_weight="balanced")

    classification_model.fit(X_train, y_train)
    y_pred_classification = classification_model.predict(X_test)

    y_severity = df_encoded[SEVERITY_TARGET]
    X_train_sev, X_test_sev, y_train_sev, y_test_sev = train_test_split(
        X,
        y_severity,
        test_size=0.2,
        random_state=42,
        stratify=y_severity,
    )

    severity_model = RandomForestClassifier(n_estimators=160, random_state=42, class_weight="balanced")
    severity_model.fit(X_train_sev, y_train_sev)
    y_pred_severity = severity_model.predict(X_test_sev)

    cluster_features = [feature for feature in CLUSTER_FEATURES if feature in feature_columns]
    clustering_model = KMeans(n_clusters=3, random_state=42, n_init="auto")
    clustering_model.fit(df_scaled[cluster_features])

    recommendation_features = [feature for feature in RECOMMENDATION_FEATURES if feature in feature_columns]
    recommendation_model = NearestNeighbors(n_neighbors=5)
    recommendation_model.fit(df_scaled[recommendation_features])

    metadata = build_metadata(
        df=df,
        encoders=encoders,
        feature_columns=feature_columns,
        numeric_columns=numeric_columns,
        categorical_columns=categorical_columns,
        cluster_features=cluster_features,
        recommendation_features=recommendation_features,
        dataset_path=dataset_path,
    )

    joblib.dump(classification_model, MODELS_DIR / "classification_model.pkl")
    joblib.dump(severity_model, MODELS_DIR / "severity_model.pkl")
    joblib.dump(clustering_model, MODELS_DIR / "clustering_model.pkl")
    joblib.dump(
        {
            "model": recommendation_model,
            "reference": df_encoded.reset_index(drop=True),
            "features": recommendation_features,
        },
        MODELS_DIR / "recommendation_model.pkl",
    )
    joblib.dump(scaler, MODELS_DIR / "scaler.pkl")
    joblib.dump(encoders, MODELS_DIR / "encoder.pkl")

    report = {
        "dataset": str(dataset_path),
        "classification_accuracy": float(accuracy_score(y_test, y_pred_classification)),
        "classification_f1": float(f1_score(y_test, y_pred_classification, zero_division=0)),
        "severity_accuracy": float(accuracy_score(y_test_sev, y_pred_severity)),
        "severity_f1_macro": float(f1_score(y_test_sev, y_pred_severity, average="macro", zero_division=0)),
        "features": feature_columns,
    }

    (MODELS_DIR / "model_metadata.json").write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    (MODELS_DIR / "training_report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    return report


def build_metadata(
    df: pd.DataFrame,
    encoders: dict[str, LabelEncoder],
    feature_columns: list[str],
    numeric_columns: list[str],
    categorical_columns: list[str],
    cluster_features: list[str],
    recommendation_features: list[str],
    dataset_path: Path,
) -> dict[str, Any]:
    numeric_defaults = {
        column: float(df[column].median())
        for column in numeric_columns
    }
    categorical_defaults = {
        column: str(df[column].mode(dropna=True).iloc[0]) if not df[column].mode(dropna=True).empty else "Unknown"
        for column in categorical_columns
    }
    category_options = {
        column: [str(value) for value in encoders[column].classes_]
        for column in categorical_columns
    }

    severity_encoder = encoders.get(SEVERITY_TARGET)
    severity_classes = (
        [str(value) for value in severity_encoder.classes_]
        if severity_encoder is not None
        else ["Low", "Medium", "High", "Severe"]
    )

    return {
        "project": "Calmi.tn",
        "source_notebook": str(NOTEBOOK_PATH),
        "dataset": str(dataset_path),
        "drop_columns": DROP_COLUMNS,
        "targets": {
            "classification": CLASSIFICATION_TARGET,
            "severity": SEVERITY_TARGET,
        },
        "columns": [*DROP_COLUMNS, *df.columns.tolist()],
        "feature_columns": feature_columns,
        "numeric_columns": numeric_columns,
        "categorical_columns": categorical_columns,
        "cluster_features": cluster_features,
        "recommendation_features": recommendation_features,
        "category_options": category_options,
        "imputation": {
            "numeric": numeric_defaults,
            "categorical": categorical_defaults,
        },
        "label_classes": {
            "classification": ["No Panic Disorder", "Panic Disorder"],
            "severity": severity_classes,
            "clusters": {
                "0": "Profil stable",
                "1": "Profil anxieux modéré",
                "2": "Profil anxieux élevé",
            },
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Train Calmi.tn models from Untitled7.ipynb dataset.")
    parser.add_argument("--dataset", help="Chemin du CSV panic_disorder_dataset_realistic.csv", default=None)
    args = parser.parse_args()
    report = train(args.dataset)
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

