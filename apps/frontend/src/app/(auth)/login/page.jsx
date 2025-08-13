'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [email, setEmail] = useState('user@test.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onLogin() {
    try {
      setLoading(true);
      const res = await api('/api/auth/login', { method: 'POST', body: { email, password } });
      localStorage.setItem('token', res.token); // opcional
      alert('Login OK');
      router.push('/profile');
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-bold">Login</h1>
      <input className="border p-2 w-full" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border p-2 w-full" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button disabled={loading} onClick={onLogin} className="px-4 py-2 rounded bg-black text-white">
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
      <p className="text-sm">¿No tienes cuenta? <a className="underline" href="/signup">Crear cuenta</a></p>
    </div>
  );
}
