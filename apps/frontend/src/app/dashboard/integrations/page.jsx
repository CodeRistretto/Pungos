export default function Integrations() {
  const connectUrl = `${process.env.NEXT_PUBLIC_API_BASE}/api/meta/oauth/login`;
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Integraciones</h1>
      <a href={connectUrl} className="px-4 py-2 rounded bg-indigo-600 text-white">
        Conectar Instagram/Facebook
      </a>
    </main>
  );
}