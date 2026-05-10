# Calmi.tn

Calmi.tn est une application MERN connectée à une couche ML Python pour analyser un questionnaire inspiré du notebook `Untitled7.ipynb`.

Le notebook a été analysé automatiquement. Les colonnes détectées sont :

- Target classification : `Panic Disorder Diagnosis`
- Target gravité : `Severity`
- Features utilisateur : `Age`, `Gender`, `Family History of Anxiety`, `Smoking`, `Alcohol Consumption`, `Sleep Quality`, `Stress Level`, `Physical Activity`, `Caffeine Intake`, `Therapy History`, `Work Pressure`, `Social Support`, `Panic Score`, `Anxiety Score`, `Depression Score`, `Heart Rate`, `Symptoms`
- Clustering : `Anxiety Score`, `Depression Score`, `Panic Score`
- Recommandations KNN : `Age`, `Sleep Quality`, `Stress Level`, `Physical Activity`, `Caffeine Intake`, `Work Pressure`, `Social Support`, `Anxiety Score`, `Depression Score`

Le code Colab a été adapté pour VS Code Windows : chemins locaux relatifs, pas de commande magique notebook, et sauvegarde automatique avec `joblib.dump()`.

## Structure

```text
calmi-tn/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/
│   ├── ml/
│   │   ├── models/
│   │   ├── predict.py
│   │   ├── preprocess.py
│   │   ├── train_from_notebook.py
│   │   └── requirements.txt
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── services/
│   ├── app.js
│   └── package.json
└── README.md
```

## Installation

### 1. Python ML

Depuis `calmi-tn/server/ml` :

```bash
pip install -r requirements.txt
python train_from_notebook.py
```

Le script cherche automatiquement le dataset mentionné dans le notebook : `panic_disorder_dataset_realistic.csv`.
Place le CSV dans le dossier racine `ml/`, dans `calmi-tn/`, ou passe le chemin explicitement :

```bash
python train_from_notebook.py --dataset "C:\chemin\vers\panic_disorder_dataset_realistic.csv"
```

Artefacts générés dans `server/ml/models/` :

- `classification_model.pkl`
- `severity_model.pkl`
- `clustering_model.pkl`
- `recommendation_model.pkl`
- `scaler.pkl`
- `encoder.pkl`
- `model_metadata.json`

### 2. Backend Express

Depuis `calmi-tn/server` :

```bash
npm install
npm run dev
```

Variables optionnelles dans `.env` :

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/calmi_tn
PYTHON_BIN=python
```

Si `MONGODB_URI` n'est pas défini, l'API continue de fonctionner sans sauvegarde MongoDB.

### 3. Frontend React

Depuis `calmi-tn/client` :

```bash
npm install
npm run dev
```

Variable optionnelle dans `.env` :

```env
VITE_API_URL=http://localhost:5000/api
```

## API

Routes disponibles :

- `POST /api/predict/classification`
- `POST /api/predict/severity`
- `POST /api/predict/recommendation`
- `POST /api/predict/clustering`
- `POST /api/predict/full`

Exemple Python direct :

```bash
python predict.py "{\"Age\":25,\"Stress Level\":\"High\",\"Anxiety Score\":8,\"Panic Score\":7}"
```

Réponse attendue :

```json
{
  "classification": "Panic Disorder",
  "severity": "Medium",
  "recommendations": [
    "Respiration guidée",
    "Suivi psychologique",
    "Activité physique"
  ],
  "cluster": "Profil anxieux modéré",
  "message": "Résultat indicatif, non médical."
}
```

## Notes importantes

- Le formulaire React est généré depuis les features détectées dans le notebook.
- Le backend appelle `server/ml/predict.py` avec les données JSON du frontend.
- `predict.py` utilise les `.pkl` si disponibles.
- Si les modèles ne sont pas encore entraînés, `predict.py` renvoie un résultat heuristique indicatif pour garder l'application testable, mais il faut lancer `train_from_notebook.py` pour utiliser les vrais modèles.
- Ce projet ne fournit pas de diagnostic médical. Les résultats sont indicatifs et doivent être interprétés avec un professionnel de santé.
