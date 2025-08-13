const logos = [
  { name: 'Instagram', svg: '<path d="M8 0h8a8 8 0 018 8v8a8 8 0 01-8 8H8a8 8 0 01-8-8V8A8 8 0 018 0zm12 6a2 2 0 100 4 2 2 0 000-4z" />' },
  { name: 'TikTok',    svg: '<path d="M9 4h4c.3 3 2.5 5 5 5v4c-2.1 0-3.9-.7-5-1.8V17a7 7 0 11-4-6.3V13a3 3 0 104 2.7V4z"/>' },
  { name: 'Google',    svg: '<path d="M21.35 11.1H12v3.8h5.4A5.7 5.7 0 016 12a6 6 0 1011.3 3.9l3.4 2.6A10 10 0 1122 12c0 .4-.04.74-.1 1.1z"/>' },
  { name: 'WhatsApp',  svg: '<path d="M20 3a10 10 0 00-8 16l-1 4 4-1A10 10 0 1020 3zm-6 14c-3 0-5.5-2.5-5.5-5.5S11 6 14 6s5.5 2.5 5.5 5.5S17 17 14 17z"/>' },
];

export default function LogoCloud() {
  return (
    <div className="section py-10">
      <p className="text-center text-sm text-slate-500 mb-6">
        Funciona con las redes y canales que ya usas
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 opacity-90">
        {logos.map((l, i) => (
          <div key={i} className="glass rounded-xl p-4 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" className="fill-current text-pungos-ink/70">
              <g dangerouslySetInnerHTML={{ __html: l.svg }} />
            </svg>
            <span className="ml-3 text-sm font-medium text-slate-700">{l.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}