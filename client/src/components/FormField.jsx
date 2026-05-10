export default function FormField({ field, value, onChange }) {
  const id = field.name.replace(/\s+/g, "-").toLowerCase();
  const baseClass =
    "mt-2 w-full rounded-2xl border border-calm-line bg-white/92 px-4 py-3 text-sm font-medium text-calm-ink shadow-sm outline-none transition focus:border-calm-violet focus:ring-4 focus:ring-calm-violet/10";

  if (field.type === "select") {
    return (
      <label htmlFor={id} className="block">
        <span className="text-sm font-semibold text-calm-ink">{field.label}</span>
        <select id={id} className={baseClass} value={value} onChange={(event) => onChange(field.name, event.target.value)}>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "range") {
    return (
      <label htmlFor={id} className="block">
        <span className="flex items-center justify-between gap-3 text-sm font-semibold text-calm-ink">
          {field.label}
          <span className="rounded-full bg-calm-lavender px-3 py-1 text-xs text-calm-violetDark">{value}</span>
        </span>
        <input
          id={id}
          type="range"
          min={field.min}
          max={field.max}
          step={field.step}
          className="mt-4 w-full accent-calm-violet"
          value={value}
          onChange={(event) => onChange(field.name, Number(event.target.value))}
        />
      </label>
    );
  }

  return (
    <label htmlFor={id} className="block">
      <span className="text-sm font-semibold text-calm-ink">{field.label}</span>
      <input
        id={id}
        type="number"
        min={field.min}
        max={field.max}
        step={field.step}
        className={baseClass}
        value={value}
        onChange={(event) => onChange(field.name, Number(event.target.value))}
      />
    </label>
  );
}
