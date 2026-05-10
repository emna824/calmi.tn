import { motion } from "framer-motion";

export function Badge({ children, tone = "violet" }) {
  const tones = {
    violet: "bg-calm-lavender text-calm-violetDark ring-1 ring-calm-violet/10",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    slate: "bg-slate-100 text-slate-700"
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ${tones[tone] || tones.violet}`}>
      {children}
    </span>
  );
}

export default function ResultCard({ icon: Icon, title, badge, tone = "violet", children }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42 }}
      className="rounded-3xl border border-white/70 bg-white/76 p-6 shadow-card backdrop-blur-xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-calm-lavender text-calm-violet">
            <Icon size={21} aria-hidden="true" />
          </span>
          <h2 className="text-lg font-bold tracking-tight text-calm-ink">{title}</h2>
        </div>
        {badge && <Badge tone={tone}>{badge}</Badge>}
      </div>
      <div className="mt-5 leading-7 text-calm-muted">{children}</div>
    </motion.article>
  );
}
