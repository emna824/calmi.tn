export default function BreathingScene() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-1/2 top-[46%] h-[33rem] w-[33rem] -translate-x-1/2 -translate-y-1/2">
        <div className="soft-pulse absolute inset-0 rounded-full border border-calm-violet/12" />
        <div className="soft-pulse absolute inset-12 rounded-full border border-calm-violet/20" />
        <div className="soft-pulse absolute inset-24 rounded-full border border-calm-violetDark/10" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-36 bg-white/62" />
      <div className="absolute bottom-12 left-0 right-0 h-px bg-calm-violet/15" />
      <div className="absolute bottom-20 left-0 right-0 h-px bg-calm-violetDark/10" />
    </div>
  );
}
