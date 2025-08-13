export default function FancyBG() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full opacity-70"
        style={{
          background:
            'conic-gradient(from 180deg at 50% 50%, #a78bfa 0deg, #60a5fa 90deg, #34d399 180deg, #f472b6 270deg, #a78bfa 360deg)'
        }}
      />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] animate-[glow_7s_ease-in-out_infinite]"
        style={{ background: 'radial-gradient(600px 600px at 50% 50%, rgba(99,102,241,.35), transparent 70%)' }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(1200px 600px at 0% -10%, rgba(191,219,254,.6), transparent 60%), radial-gradient(1200px 600px at 100% 10%, rgba(224,231,255,.6), transparent 60%)'
        }}
      />
    </div>
  );
}
