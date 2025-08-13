const reviews = [
  { n: 'Ana R.',    t: 'Subí una historia y me dieron 20% OFF al instante 🔥' },
  { n: 'Carlos M.', t: 'El QR en caja funciona rapidísimo. Buen UX.' },
  { n: 'Lupita S.', t: 'Gané un capuchino gratis por etiquetar 😍' },
  { n: 'Jorge T.',  t: 'Panel claro y sin complicaciones.' },
  { n: 'María P.',  t: 'Por fin ROI real del UGC.' },
];

export default function ReviewsMarquee() {
  const data = [...reviews, ...reviews]; // duplicado para bucle infinito
  return (
    <div className="bg-pungos-muted/60 py-8 border-t border-b border-slate-200">
      <div className="overflow-hidden">
        <div className="marquee flex gap-6 whitespace-nowrap">
          {data.map((r, i) => (
            <div key={i} className="inline-flex items-center gap-3 px-5 py-3 rounded-full glass shadow-soft">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500" />
              <span className="text-sm text-slate-800"><b>{r.n}</b> — {r.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}