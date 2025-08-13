export default function GlowBackground() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradiente grande */}
      <img
        src="/svg/gradient-blob.svg"
        alt=""
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] opacity-70 floaty safe-motion"
        loading="eager"
      />
      {/* Grid suave con máscara */}
      <img
        src="/svg/grid.svg"
        alt=""
        className="absolute inset-0 grid-mask"
        loading="lazy"
      />
      {/* Orb sutil */}
      <div className="bg-orb" />
    </div>
  );
}
