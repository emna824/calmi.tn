import { Link } from "react-router-dom";

const styles = {
  primary:
    "bg-calm-violet text-white shadow-soft hover:bg-calm-violetDark focus-visible:outline-calm-violet",
  secondary:
    "border border-white/70 bg-white/78 text-calm-violetDark shadow-sm backdrop-blur hover:border-calm-violet/30 hover:bg-calm-lavender/70 focus-visible:outline-calm-violet"
};

export default function Button({ as = "button", to, variant = "primary", className = "", children, ...props }) {
  const classes = `inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-70 ${styles[variant]} ${className}`;

  if (as === "link") {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (as === "a") {
    return (
      <a href={to} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
