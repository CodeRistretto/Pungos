export const dynamic = 'force-dynamic';

export default function Integrations() {
  const api = process.env.NEXT_PUBLIC_API_BASE || 'https://api.pungos.com';
  const url = `${api}/api/meta/oauth/start`;
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Integraciones</h1>
      <p className="text-gray-600 mb-4">
        Conecta tu página de Facebook/Instagram para automatizar menciones y recompensas.
      </p>
      <a href={url} className="inline-block px-4 py-2 rounded bg-indigo-600 text-white">
        Conectar Instagram/Facebook
      </a>
      <div className="mt-6 text-sm text-gray-500">
        <p>Callback OK: /dashboard/integrations/meta/callback</p>
        <p>Éxito: /dashboard/integrations/meta/success</p>
      </div>
    </main>
  );
}
