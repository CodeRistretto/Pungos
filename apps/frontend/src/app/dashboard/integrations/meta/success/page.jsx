export const dynamic = 'force-dynamic';

export default function MetaSuccess() {
  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-emerald-600">¡Cuenta conectada!</h1>
      <div className="mt-3 rounded border bg-white p-4">
        <p className="text-gray-700">
          Tu página/Instagram quedó vinculada. Ya podemos recibir menciones cuando actives los webhooks.
        </p>
      </div>
      <a href="/dashboard" className="inline-block mt-6 px-4 py-2 bg-black text-white rounded">
        Ir al panel
      </a>
    </main>
  );
}
