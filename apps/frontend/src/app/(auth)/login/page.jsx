'use client';
import { useState } from 'react';
import { Auth } from '@/lib/api';
import Link from 'next/link';

export default function LoginPage(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [loading,setLoading] = useState(false);

  async function onSubmit(e){
    e.preventDefault();
    setLoading(true);
    try{
      await Auth.login({ email, password });
      window.location.href = '/profile';
    }catch(e){
      alert(e.message);
    }finally{ setLoading(false); }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="border p-2 w-full rounded" type="email" placeholder="Email"
               value={email} onChange={e=>setEmail(e.target.value)}/>
        <input className="border p-2 w-full rounded" type="password" placeholder="Contraseña"
               value={password} onChange={e=>setPassword(e.target.value)}/>
        <button disabled={loading} className="bg-black text-white px-4 py-2 rounded w-full">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <div className="mt-3 text-sm flex justify-between">
        <Link href="/signup" className="underline">Crear cuenta</Link>
        <Link href="/forgot" className="underline">¿Olvidaste tu contraseña?</Link>
      </div>
    </main>
  );
}
