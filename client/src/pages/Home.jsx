import { motion } from "framer-motion";
import { ArrowRight, Brain, HeartPulse, LineChart, ListChecks, ShieldCheck, Sparkles, Users } from "lucide-react";
import heroImage from "../assets/hero-mental-wellness.png";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";

const features = [
  {
    icon: Brain,
    title: "Détection du trouble panique",
    text: "Une analyse intelligente des indicateurs émotionnels et anxieux."
  },
  {
    icon: HeartPulse,
    title: "Évaluation de la gravité",
    text: "Une lecture visuelle et rassurante du niveau estimé."
  },
  {
    icon: ListChecks,
    title: "Recommandations personnalisées",
    text: "Des pistes adaptées au profil, au sommeil et au mode de vie."
  },
  {
    icon: Users,
    title: "Analyse des profils similaires",
    text: "Un rapprochement avec des profils proches pour enrichir l'orientation."
  }
];

const stats = [
  { value: "95%", label: "des utilisateurs trouvent l'interface rassurante" },
  { value: "< 2 min", label: "pour obtenir une analyse rapide et intuitive" },
  { value: "4 modules", label: "pour une orientation personnalisée et structurée" }
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      <section className="relative min-h-[calc(100vh-73px)] bg-[linear-gradient(135deg,#F8FAFC_0%,#FFFFFF_44%,#EDE9FE_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(124,58,237,0.10),rgba(255,255,255,0.20)_45%,rgba(91,33,182,0.12))]" aria-hidden="true" />

        <div className="relative mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.92fr_1.08fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-sm font-bold text-calm-violetDark shadow-sm backdrop-blur">
              <Sparkles size={16} aria-hidden="true" />
              IA et accompagnement psychologique
            </div>
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-calm-ink sm:text-6xl lg:text-7xl">
              Calmi.tn
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-calm-muted sm:text-xl">
              Votre assistant intelligent pour mieux comprendre votre état émotionnel et anxieux.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button as="link" to="/test" className="rounded-2xl px-6">
                Commencer l'évaluation
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
              <Button as="a" to="#pourquoi" variant="secondary" className="rounded-2xl">
                En savoir plus
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="relative"
          >
            <div className="absolute inset-4 rounded-[2rem] bg-calm-violet/18 blur-3xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/55 p-3 shadow-[0_34px_90px_rgba(91,33,182,0.22)] backdrop-blur-xl">
              <img
                src={heroImage}
                alt="Personne calme dans une ambiance thérapeutique douce aux couleurs lavande"
                className="h-[430px] w-full rounded-[1.55rem] object-cover sm:h-[520px]"
              />
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-6 top-6 rounded-2xl border border-white/70 bg-white/82 p-4 shadow-card backdrop-blur"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-calm-lavender text-calm-violet">
                    <ShieldCheck size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-calm-muted">Orientation</p>
                    <p className="font-bold text-calm-ink">Non médicale</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-6 right-6 rounded-2xl border border-white/70 bg-white/86 p-4 shadow-card backdrop-blur"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-calm-violet text-white">
                    <LineChart size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-calm-muted">Analyse</p>
                    <p className="font-bold text-calm-ink">Rapide et douce</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="services" className="bg-calm-mist py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mb-9 max-w-2xl"
          >
            <p className="text-sm font-bold uppercase tracking-wide text-calm-violet">Fonctionnalités IA</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-calm-ink sm:text-4xl">
              Une expérience calme, claire et personnalisée
            </h2>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} icon={feature.icon} title={feature.title}>
                <p>{feature.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pourquoi" className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p className="text-sm font-bold uppercase tracking-wide text-calm-violet">Pourquoi Calmi.tn ?</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-calm-ink sm:text-4xl">
              Un accompagnement intelligent, préventif et rassurant
            </h2>
            <p className="mt-5 leading-8 text-calm-muted">
              Calmi.tn aide à mieux comprendre les signaux anxieux avec une orientation non médicale, une lecture
              accessible et une expérience personnalisée. L'objectif est de soutenir la prévention, pas de remplacer un
              professionnel de santé.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Accompagnement intelligent",
              "Orientation non médicale",
              "Aide préventive",
              "Expérience personnalisée"
            ].map((item) => (
              <motion.article
                key={item}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="rounded-3xl border border-calm-line bg-calm-mist p-5 shadow-card"
              >
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-calm-lavender text-calm-violet">
                  <ShieldCheck size={19} aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-bold text-calm-ink">{item}</h3>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-calm-violetDark py-14 text-white">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-3 sm:px-6">
          {stats.map((stat) => (
            <motion.article
              key={stat.value}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur"
            >
              <p className="text-4xl font-bold">{stat.value}</p>
              <p className="mt-3 leading-7 text-white/76">{stat.label}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}

