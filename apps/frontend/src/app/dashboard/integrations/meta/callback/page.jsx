// ✅ Server Component: NO usa useSearchParams, compila bien en Vercel
export const dynamic = 'force-dynamic'; // evita prerender rígido si prefieres

export default function MetaCallback({ searchParams }) {
  const error = searchParams?.error || null;
  const reason = searchParams?.reason || null;
  const desc = searchParams?.desc || searchParams?.msg || null;

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold">Conexión con Meta</h1>

      {!error ? (
        <div className="mt-3 rounded border bg-white p-4">
          <p className="text-gray-700">
            Procesando tu conexión… si ves esta pantalla directo, probablemente llegaste sin parámetros.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Espera a que Meta redireccione aquí con el resultado del OAuth.
          </p>
        </div>
      ) : (
        <div className="mt-3 rounded border bg-white p-4">
          <p className="text-red-600 font-semibold">Error: {error}</p>
          {reason && <p className="text-gray-700">Motivo: {reason}</p>}
          {desc && <p className="text-gray-700">Detalle: {desc}</p>}
          <p className="text-xs text-gray-500 mt-2">
            Si cancelaste permisos en Facebook, vuelve a intentarlo y acepta los permisos solicitados.
          </p>
        </div>
      )}

      <a href="/dashboard" className="inline-block mt-6 px-4 py-2 bg-black text-white rounded">
        Volver al panel
      </a>
    </main>
  );
}
