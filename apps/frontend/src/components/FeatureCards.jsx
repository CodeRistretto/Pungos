const items = [
  { t: 'Campañas con reglas', d: 'Historia IG + @mención → 20 pts. Define límites y plantillas de cupones.' },
  { t: 'UGC con evidencia', d: 'Usuarios envían URL + screenshot. Moderación simple o semiautomática.' },
  { t: 'Cupones con QR', d: 'Emite cupones one-time firmados (JWT). Canjea con el lector web.' },
];

export default function FeatureCards() {
  return (
    <section id="como-funciona" className="section section-py">
      <h2 className="text-2xl font-bold mb-6 text-pungos-ink">¿Cómo funciona?</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((f, i) => (
          <div key={i} className="card-3d card">
            <div className="badge mb-3">Paso {i + 1}</div>
            <p className="font-semibold text-slate-900">{f.t}</p>
            <p className="text-slate-600 mt-1">{f.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}