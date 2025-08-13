'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [name, setName] = useState('User');
  const [email, setEmail] = useState('user@test.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSignup() {
    try {
      setLoading(true);
      const res = await api('/api/auth/signup', { method: 'POST', body: { name, email, password } });
      localStorage.setItem('token', res.token); // opcional
      alert('Registro OK');
      router.push('/login');
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-bold">Crear cuenta</h1>
      <input className="border p-2 w-full" placeholder="Nombre" value={name} onChange={e=>setName(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border p-2 w-full" type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} />
      <button disabled={loading} onClick={onSignup} className="px-4 py-2 rounded bg-black text-white">
        {loading ? 'Creando...' : 'Registrarme'}
      </button>
      <p className="text-sm">¿Ya tienes cuenta? <a className="underline" href="/login">Entrar</a></p>
    </div>
  );
}
