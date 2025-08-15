import Link from 'next/link';

export default function IntegrationsIndex() {
  return (
    <main className="section section-py">
      <h1 className="text-2xl font-bold mb-6">Integraciones</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold">Instagram (Meta)</p>
              <p className="text-sm text-slate-500">
                Conecta tu cuenta para detectar historias y menciones.
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Link href="/dashboard/integrations/meta" className="btn btn-primary">
              Conectar
            </Link>
            <a
              href="https://developers.facebook.com/docs/instagram-api"
              target="_blank" rel="noreferrer"
              className="btn btn-ghost"
            >
              Documentación
            </a>
          </div>
        </div>

        {/* espacio para futuras integraciones */}
        <div className="card">
          <p className="font-semibold">Próximamente</p>
          <p className="text-sm text-slate-500">TikTok, X (Twitter), YouTube…</p>
        </div>
      </div>
    </main>
  );
}
