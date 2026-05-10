import { motion } from "framer-motion";

export default function FormSection({ icon: Icon, title, description, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45 }}
      className="rounded-3xl border border-white/70 bg-white/88 p-5 shadow-card backdrop-blur sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-calm-lavender text-calm-violet">
          <Icon size={21} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-calm-ink">{title}</h2>
          {description && <p className="mt-1 text-sm leading-6 text-calm-muted">{description}</p>}
        </div>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">{children}</div>
    </motion.section>
  );
}
