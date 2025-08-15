'use client';
export default function Integrations() {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/api/meta/oauth/start`;
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Integraciones</h1>
      <p className="text-gray-600 mb-4">Conecta tu página de Facebook/Instagram para automatizar menciones.</p>
      <a href={url} className="inline-block px-4 py-2 rounded bg-indigo-600 text-white">Conectar Instagram/Facebook</a>
    </main>
  );
}
