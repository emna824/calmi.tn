// Generated from Untitled7.ipynb: backend feature names are preserved exactly.
export const formFields = [
  {
    name: "Age",
    label: "Âge",
    type: "number",
    min: 12,
    max: 90,
    step: 1,
    defaultValue: 25,
    group: "Informations générales"
  },
  {
    name: "Gender",
    label: "Genre",
    type: "select",
    options: ["Female", "Male"],
    defaultValue: "Female",
    group: "Informations générales"
  },
  {
    name: "Heart Rate",
    label: "Fréquence cardiaque",
    type: "number",
    min: 45,
    max: 150,
    step: 0.1,
    defaultValue: 75,
    group: "Informations générales"
  },
  {
    name: "Smoking",
    label: "Tabagisme",
    type: "select",
    options: ["No", "Yes"],
    defaultValue: "No",
    group: "Mode de vie"
  },
  {
    name: "Alcohol Consumption",
    label: "Consommation d'alcool",
    type: "select",
    options: ["Low", "Moderate", "High"],
    defaultValue: "Low",
    group: "Mode de vie"
  },
  {
    name: "Sleep Quality",
    label: "Qualité du sommeil",
    type: "select",
    options: ["Good", "Average", "Poor"],
    defaultValue: "Average",
    group: "Mode de vie"
  },
  {
    name: "Physical Activity",
    label: "Activité physique",
    type: "select",
    options: ["Low", "Moderate", "High"],
    defaultValue: "Moderate",
    group: "Mode de vie"
  },
  {
    name: "Caffeine Intake",
    label: "Consommation de caféine",
    type: "select",
    options: ["Low", "Moderate", "High"],
    defaultValue: "Moderate",
    group: "Mode de vie"
  },
  {
    name: "Stress Level",
    label: "Niveau de stress",
    type: "select",
    options: ["Low", "Moderate", "High"],
    defaultValue: "Moderate",
    group: "Stress et anxiété"
  },
  {
    name: "Work Pressure",
    label: "Pression au travail",
    type: "select",
    options: ["Low", "Moderate", "High"],
    defaultValue: "Moderate",
    group: "Stress et anxiété"
  },
  {
    name: "Panic Score",
    label: "Score de panique",
    type: "range",
    min: 0,
    max: 10,
    step: 0.1,
    defaultValue: 4,
    group: "Stress et anxiété"
  },
  {
    name: "Anxiety Score",
    label: "Score d'anxiété",
    type: "range",
    min: 0,
    max: 10,
    step: 0.1,
    defaultValue: 5,
    group: "Stress et anxiété"
  },
  {
    name: "Depression Score",
    label: "Score de dépression",
    type: "range",
    min: 0,
    max: 10,
    step: 0.1,
    defaultValue: 4,
    group: "Stress et anxiété"
  },
  {
    name: "Symptoms",
    label: "Symptômes dominants",
    type: "select",
    options: [
      "None/Mild",
      "Palpitations",
      "Shortness of Breath",
      "Fear of Losing Control",
      "Chest Pain",
      "Dizziness",
      "Sweating",
      "Nausea"
    ],
    defaultValue: "None/Mild",
    group: "Stress et anxiété"
  },
  {
    name: "Family History of Anxiety",
    label: "Antécédents familiaux d'anxiété",
    type: "select",
    options: ["No", "Yes"],
    defaultValue: "No",
    group: "Antécédents et soutien"
  },
  {
    name: "Therapy History",
    label: "Suivi thérapeutique antérieur",
    type: "select",
    options: ["No", "Yes"],
    defaultValue: "No",
    group: "Antécédents et soutien"
  },
  {
    name: "Social Support",
    label: "Soutien social",
    type: "select",
    options: ["Low", "Moderate", "High"],
    defaultValue: "Moderate",
    group: "Antécédents et soutien"
  }
];

export const sectionMeta = {
  "Informations générales": {
    description: "Les données de base nécessaires à l'analyse du profil."
  },
  "Mode de vie": {
    description: "Les habitudes quotidiennes qui peuvent influencer le bien-être mental."
  },
  "Stress et anxiété": {
    description: "Les indicateurs subjectifs liés au stress, à la panique et aux symptômes."
  },
  "Antécédents et soutien": {
    description: "Les facteurs de contexte, de suivi et de support social."
  }
};

export const groupedFields = formFields.reduce((groups, field) => {
  groups[field.group] = groups[field.group] || [];
  groups[field.group].push(field);
  return groups;
}, {});
