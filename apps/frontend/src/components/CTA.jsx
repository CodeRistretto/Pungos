import Link from 'next/link';

export default function CTA() {
  return (
    <section className="relative section section-py">
      <div className="absolute inset-0 -z-10 opacity-70">
        <div
          className="w-full h-full"
          style={{ background: 'radial-gradient(600px 200px at 50% 0%, rgba(99,102,241,.25), transparent 60%)' }}
        />
      </div>

      <div className="glass rounded-2xl p-8 md:p-12 text-center shadow-soft">
        <h3 className="text-2xl md:text-3xl font-extrabold text-pungos-ink">Convierte UGC en clientes fieles</h3>
        <p className="text-slate-600 mt-2">Empieza gratis y lanza tu primera campaña en minutos.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/signup" className="btn-primary">Crear cuenta</Link>
          <Link href="/login" className="btn-ghost">Ya tengo cuenta</Link>
        </div>
        <p className="mt-2 text-xs text-slate-500">Sin tarjeta. Cancelas cuando quieras.</p>
      </div>
    </section>
  );
}
