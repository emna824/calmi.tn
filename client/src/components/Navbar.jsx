import { AnimatePresence, motion } from "framer-motion";
import { Brain, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/test", label: "Test" },
  { to: "/resultats", label: "Résultats" }
];

const navClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-calm-violet text-white shadow-sm"
      : "text-calm-muted hover:bg-calm-lavender/80 hover:text-calm-violetDark"
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 16);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled);
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: scrolled ? "rgba(255, 255, 255, 0.88)" : "rgba(255, 255, 255, 0.42)",
        boxShadow: scrolled ? "0 12px 30px rgba(91, 33, 182, 0.10)" : "0 0 0 rgba(0, 0, 0, 0)"
      }}
      transition={{ duration: 0.25 }}
      className="sticky top-0 z-40 border-b border-white/50 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3 font-bold text-calm-violetDark" onClick={() => setOpen(false)}>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-calm-violet text-white shadow-soft">
            <Brain size={21} aria-hidden="true" />
          </span>
          <span className="text-xl tracking-tight">Calmi.tn</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-2xl border border-calm-line bg-white/90 text-calm-violetDark shadow-sm md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="border-t border-calm-line bg-white/95 px-4 py-3 backdrop-blur md:hidden"
        >
          <div className="mx-auto grid max-w-6xl gap-2">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={navClass} onClick={() => setOpen(false)}>
                {link.label}
              </NavLink>
            ))}
          </div>
        </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
