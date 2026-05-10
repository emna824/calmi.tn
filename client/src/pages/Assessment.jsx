import { motion } from "framer-motion";
import { Activity, Brain, HeartHandshake, Loader2, Send, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import Disclaimer from "../components/Disclaimer.jsx";
import FormField from "../components/FormField.jsx";
import FormSection from "../components/FormSection.jsx";
import { formFields, groupedFields, sectionMeta } from "../config/formSchema.js";
import { predictFull } from "../services/api.js";

const initialValues = formFields.reduce((values, field) => {
  values[field.name] = field.defaultValue;
  return values;
}, {});

const sectionIcons = {
  "Informations générales": UserRound,
  "Mode de vie": Activity,
  "Stress et anxiété": Brain,
  "Antécédents et soutien": HeartHandshake
};

export default function Assessment() {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const groupNames = useMemo(() => Object.keys(groupedFields), []);
  const completedFields = formFields.filter((field) => values[field.name] !== "" && values[field.name] !== undefined).length;
  const progress = Math.round((completedFields / formFields.length) * 100);

  function updateField(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function submitAssessment(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await predictFull(values);
      navigate("/resultats", { state: { result, inputs: values } });
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Impossible de contacter l'API de prédiction.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative overflow-hidden bg-[linear-gradient(180deg,#F8FAFC_0%,#FFFFFF_48%,#EDE9FE_130%)]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_380px] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-sm font-bold uppercase tracking-wide text-calm-violet">Évaluation psychologique guidée</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-calm-ink sm:text-4xl">Analyser mon profil</h1>
            <p className="mt-4 max-w-3xl leading-7 text-calm-muted">
              Une série de questions organisée pour rester claire, douce et centrée sur votre bien-être mental.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-white/70 bg-white/82 p-5 shadow-card backdrop-blur-xl"
          >
            <div className="flex items-center justify-between text-sm font-bold text-calm-ink">
              <span>Progression</span>
              <span className="text-calm-violetDark">{progress}%</span>
            </div>
            <div className="mt-3 h-3 rounded-full bg-calm-lavender">
              <motion.div
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35 }}
                className="h-3 rounded-full bg-[linear-gradient(90deg,#7C3AED,#5B21B6)]"
              />
            </div>
            <p className="mt-3 text-xs font-medium text-calm-muted">
              {completedFields} champs renseignés sur {formFields.length}
            </p>
          </motion.div>
        </div>

        <form onSubmit={submitAssessment} className="grid gap-6">
          {groupNames.map((groupName) => {
            const Icon = sectionIcons[groupName] || Brain;

            return (
              <FormSection key={groupName} icon={Icon} title={groupName} description={sectionMeta[groupName]?.description}>
                {groupedFields[groupName].map((field) => (
                  <FormField key={field.name} field={field} value={values[field.name]} onChange={updateField} />
                ))}
              </FormSection>
            );
          })}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700"
            >
              {error}
            </motion.div>
          )}

          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <Disclaimer />
            <Button type="submit" disabled={loading} className="min-h-14 rounded-2xl px-7">
              {loading ? <Loader2 className="animate-spin" size={19} aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
              Analyser mon profil
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

