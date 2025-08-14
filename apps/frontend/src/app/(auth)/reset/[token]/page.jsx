'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Auth } from '@/lib/api';

export default function ResetPage(){
  const { token } = useParams();
  const [password,setPassword] = useState('');
  const [done,setDone] = useState(false);
  const [loading,setLoading] = useState(false);

  async function onSubmit(e){
    e.preventDefault();
    setLoading(true);
    try{
      await Auth.reset(token, password);
      setDone(true);
    }catch(e){ alert(e.message); }
    finally{ setLoading(false); }
  }

  if(done) return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">¡Listo!</h1>
      <p>Tu contraseña fue actualizada. <a href="/login" className="underline">Inicia sesión</a>.</p>
    </main>
  );

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Nueva contraseña</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="border p-2 w-full rounded" type="password" placeholder="Nueva contraseña"
               value={password} onChange={e=>setPassword(e.target.value)}/>
        <button disabled={loading} className="bg-black text-white px-4 py-2 rounded w-full">
          {loading ? 'Actualizando...' : 'Guardar'}
        </button>
      </form>
    </main>
  );
}
