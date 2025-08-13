'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api('/api/auth/me').then(r => setUser(r.user)).catch(() => {
      window.location.href = '/login';
    });
  }, []);

  if (!user) return <div className="p-6">Cargando...</div>;

  return (
    <main>
      <Navbar />
      <section className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">Perfil</h1>
        <div className="border rounded-xl bg-white p-6">
          <p><b>Nombre:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Roles:</b> {user.roles?.join(', ')}</p>
          <button
            onClick={async () => { try { await api('/api/auth/logout', { method:'POST' }); } catch{} localStorage.removeItem('token'); window.location.href='/login'; }}
            className="mt-4 px-4 py-2 rounded bg-red-600 text-white"
          >
            Cerrar sesión
          </button>
        </div>
      </section>
      <Footer />
    </main>
  );
}
