import { motion } from "framer-motion";

export default function Card({ icon: Icon, title, children, className = "" }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`rounded-3xl border border-white/70 bg-white/86 p-6 shadow-card backdrop-blur ${className}`}
    >
      {Icon && (
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-calm-lavender text-calm-violet">
          <Icon size={22} aria-hidden="true" />
        </span>
      )}
      {title && <h2 className="mt-5 text-xl font-bold tracking-tight text-calm-ink">{title}</h2>}
      {children && <div className="mt-3 leading-7 text-calm-muted">{children}</div>}
    </motion.article>
  );
}
