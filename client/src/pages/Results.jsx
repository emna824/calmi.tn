import { motion } from "framer-motion";
import { ArrowLeft, BadgeCheck, Brain, HeartPulse, ListChecks, RotateCcw, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Button from "../components/Button.jsx";
import ResultCard, { Badge } from "../components/ResultCard.jsx";

function severityTone(severity = "") {
  const value = severity.toLowerCase();
  if (value.includes("low")) return "green";
  if (value.includes("medium") || value.includes("moderate")) return "amber";
  if (value.includes("high") || value.includes("severe")) return "rose";
  return "violet";
}

function classificationTone(classification = "") {
  return classification.toLowerCase().includes("no panic") ? "green" : "amber";
}

function severityScore(severity = "") {
  const value = severity.toLowerCase();
  if (value.includes("low")) return 25;
  if (value.includes("medium") || value.includes("moderate")) return 55;
  if (value.includes("high")) return 78;
  if (value.includes("severe")) return 92;
  return 50;
}

export default function Results() {
  const { state } = useLocation();
  const result = state?.result;

  if (!result) {
    return (
      <main className="min-h-[70vh] bg-[linear-gradient(180deg,#F8FAFC,#EDE9FE)] px-4 py-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl rounded-3xl border border-white/70 bg-white/80 p-8 text-center shadow-card backdrop-blur-xl"
        >
          <Brain className="mx-auto text-calm-violet" size={42} aria-hidden="true" />
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-calm-ink">Aucun résultat disponible</h1>
          <p className="mt-4 text-calm-muted">Lancez un test pour afficher l'analyse complète.</p>
          <Button as="link" to="/test" className="mt-8 rounded-2xl">
            <ArrowLeft size={18} aria-hidden="true" />
            Revenir au test
          </Button>
        </motion.div>
      </main>
    );
  }

  const recommendations = result.recommendations || [];
  const score = severityScore(result.severity);

  return (
    <main className="relative overflow-hidden bg-[linear-gradient(135deg,#F8FAFC_0%,#FFFFFF_48%,#EDE9FE_120%)]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link to="/test" className="inline-flex items-center gap-2 text-sm font-bold text-calm-violetDark hover:text-calm-violet">
          <ArrowLeft size={17} aria-hidden="true" />
          Modifier mes réponses
        </Link>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mt-6 rounded-[2rem] border border-white/70 bg-white/76 p-6 shadow-card backdrop-blur-xl sm:p-8"
        >
          <div className="grid gap-7 lg:grid-cols-[1fr_220px] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-calm-violet">Synthèse de l'évaluation</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-calm-ink sm:text-4xl">Résultats Calmi.tn</h1>
              <p className="mt-4 max-w-2xl leading-7 text-calm-muted">
                Ces résultats sont indicatifs et ne remplacent pas un avis médical.
              </p>
            </div>

            <div className="mx-auto grid h-44 w-44 place-items-center rounded-full bg-white shadow-soft">
              <div
                className="grid h-36 w-36 place-items-center rounded-full"
                style={{
                  background: `conic-gradient(#7C3AED ${score * 3.6}deg, #EDE9FE 0deg)`
                }}
              >
                <div className="grid h-28 w-28 place-items-center rounded-full bg-white text-center">
                  <div>
                    <p className="text-3xl font-bold text-calm-violetDark">{score}%</p>
                    <p className="text-xs font-bold uppercase tracking-wide text-calm-muted">gravité</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <ResultCard
            icon={BadgeCheck}
            title="Classification"
            badge={result.classification}
            tone={classificationTone(result.classification)}
          >
            <p>Le modèle estime la présence ou l'absence probable d'un trouble panique.</p>
          </ResultCard>

          <ResultCard icon={HeartPulse} title="Gravité" badge={result.severity} tone={severityTone(result.severity)}>
            <p>Ce niveau aide à situer l'intensité probable des indicateurs observés.</p>
          </ResultCard>

          <ResultCard icon={Users} title="Profil similaire" badge={result.cluster} tone="violet">
            <p>Votre profil est rapproché de profils similaires pour enrichir les recommandations.</p>
          </ResultCard>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mt-6 rounded-[2rem] border border-white/70 bg-white/76 p-6 shadow-card backdrop-blur-xl sm:p-8"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-calm-lavender text-calm-violet">
                <ListChecks size={21} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-calm-ink">Recommandations personnalisées</h2>
                <p className="mt-1 text-sm text-calm-muted">Des pistes simples pour soutenir le bien-être au quotidien.</p>
              </div>
            </div>
            <Button as="link" to="/test" variant="secondary" className="rounded-2xl">
              <RotateCcw size={18} aria-hidden="true" />
              Refaire le test
            </Button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((recommendation, index) => (
              <motion.article
                key={recommendation}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 * index }}
                className="rounded-3xl border border-calm-line bg-calm-mist/80 p-5 shadow-sm"
              >
                <Badge tone="violet">Conseil</Badge>
                <p className="mt-4 font-semibold leading-6 text-calm-ink">{recommendation}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>
      </div>
    </main>
  );
}

