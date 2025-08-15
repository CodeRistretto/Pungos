import Link from 'next/link';

const tiles = [
  {
    href: '/dashboard/campaigns',
    title: 'Campañas',
    desc: 'Crea y gestiona campañas (historias, hashtags, etc.)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M4 6h16M4 12h10M4 18h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/integrations',
    title: 'Integraciones',
    desc: 'Conecta Instagram (Meta) y más redes',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/ugc',
    title: 'UGC',
    desc: 'Contenido generado por usuarios (entrante)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M4 5h16v12H5l-1 1V5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/moderation',
    title: 'Moderación',
    desc: 'Aprueba o rechaza UGC; asigna cupones',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/rules',
    title: 'Reglas',
    desc: 'Define reglas/condiciones de campañas',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M8 7h8M8 12h8M8 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/redeem',
    title: 'Canjeo (QR / códigos)',
    desc: 'Escanear / validar cupones en tienda',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    href: '/profile',
    title: 'Perfil',
    desc: 'Datos de tu cuenta y negocio',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 12a5 5 0 100-10 5 5 0 000 10zM3 22a9 9 0 1118 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function DashboardPage() {
  return (
    <main className="section section-py">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Panel</h1>
          <p className="text-sm text-slate-500">Bienvenido a Pungos. Gestiona campañas, integraciones y UGC.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/campaigns" className="btn btn-primary">Nueva campaña</Link>
          <Link href="/dashboard/integrations" className="btn btn-ghost">Conectar redes</Link>
        </div>
      </div>

      {/* Stats de ejemplo (placeholder) */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Stat title="UGC pendientes" value="—" hint="cuando conectes Meta aparecerán aquí" />
        <Stat title="Cupones emitidos" value="—" />
        <Stat title="Ingresos estimados" value="$ —" />
      </div>

      {/* Acciones principales */}
      <h2 className="text-lg font-semibold mb-3">Accesos rápidos</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {tiles.map(t => (
          <Link
            key={t.href}
            href={t.href}
            className="card hover:shadow-md transition"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-slate-100 text-slate-700">{t.icon}</div>
              <div>
                <p className="font-semibold">{t.title}</p>
                <p className="text-sm text-slate-500">{t.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

function Stat({ title, value, hint }) {
  return (
    <div className="card">
      <p className="text-slate-500 text-sm">{title}</p>
      <p className="text-3xl font-extrabold mt-1">{value}</p>
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}
