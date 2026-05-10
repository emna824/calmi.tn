import { Brain, HeartPulse, ShieldCheck, Stethoscope } from "lucide-react";

export default function MedicalIllustration() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]" aria-hidden="true">
      <div className="absolute inset-5 rounded-full bg-calm-lavender" />
      <div className="soft-pulse absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-soft" />
      <div className="absolute left-1/2 top-1/2 grid h-44 w-44 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg border border-calm-line bg-white shadow-card">
        <Brain className="text-calm-violet" size={72} />
        <div className="absolute bottom-6 h-2 w-24 rounded-full bg-calm-lavender" />
      </div>
      <div className="absolute left-4 top-16 grid h-20 w-20 place-items-center rounded-lg bg-white text-calm-violetDark shadow-card">
        <Stethoscope size={30} />
      </div>
      <div className="absolute right-2 top-24 grid h-20 w-20 place-items-center rounded-lg bg-white text-calm-violetDark shadow-card">
        <HeartPulse size={31} />
      </div>
      <div className="absolute bottom-14 left-10 grid h-20 w-20 place-items-center rounded-lg bg-white text-calm-violetDark shadow-card">
        <ShieldCheck size={31} />
      </div>
      <div className="absolute bottom-10 right-12 rounded-lg bg-calm-violet px-4 py-3 text-sm font-bold text-white shadow-soft">
        IA santé mentale
      </div>
    </div>
  );
}
