'use client';
import { useSearchParams } from 'next/navigation';

export default function MetaCallback() {
  const q = useSearchParams();
  const error = q.get('error');
  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold">Conexión con Meta</h1>
      {!error ? <p>Procesando…</p> : (
        <>
          <p className="mt-2 text-red-600">Error: {error}</p>
          <p className="text-xs text-gray-500">Si cancelaste permisos en Facebook, inténtalo de nuevo.</p>
        </>
      )}
      <a href="/dashboard" className="inline-block mt-6 px-4 py-2 bg-black text-white rounded">Volver al panel</a>
    </main>
  );
}
