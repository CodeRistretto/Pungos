'use client';
import { useState } from 'react';

export default function MetaIntegration() {
  const [loading, setLoading] = useState(false);

  const startOAuth = () => {
    setLoading(true);
    // backend: inicia flujo OAuth de Meta
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE}/api/meta/oauth/start`;
  };

  return (
    <main className="section section-py">
      <h1 className="text-2xl font-bold mb-2">Instagram (Meta)</h1>
      <p className="text-sm text-slate-500 mb-6">
        Conecta tu cuenta de Instagram Business para que Pungos detecte historias que te mencionen
        y pueda otorgar cupones automáticamente.
      </p>

      <div className="card">
        <ol className="list-decimal pl-5 text-sm text-slate-600 space-y-2">
          <li>Verifica que tu cuenta sea <b>Instagram Business</b> o <b>Creator</b>.</li>
          <li>Debe estar vinculada a una <b>página de Facebook</b>.</li>
          <li>Haz clic en “Conectar Meta” y autoriza los permisos solicitados.</li>
        </ol>

        <button
          onClick={startOAuth}
          disabled={loading}
          className="btn btn-primary mt-5"
        >
          {loading ? 'Redirigiendo…' : 'Conectar Meta'}
        </button>
      </div>
    </main>
  );
}
