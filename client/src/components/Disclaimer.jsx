import { ShieldAlert } from "lucide-react";

export default function Disclaimer() {
  return (
    <div className="flex gap-3 rounded-lg border border-calm-violet/15 bg-calm-lavender/55 p-4 text-sm leading-6 text-calm-ink">
      <ShieldAlert className="mt-0.5 shrink-0 text-calm-violetDark" size={18} aria-hidden="true" />
      <p>
        Ces résultats sont indicatifs et ne remplacent pas un diagnostic médical professionnel. En cas de malaise
        intense ou de risque immédiat, contactez un professionnel de santé ou les services d'urgence.
      </p>
    </div>
  );
}
