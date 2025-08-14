'use client';
import { useState } from 'react';
import { Auth } from '@/lib/api';

export default function ForgotPage(){
  const [email,setEmail] = useState('');
  const [sent,setSent] = useState(false);
  const [loading,setLoading] = useState(false);

  async function onSubmit(e){
    e.preventDefault();
    setLoading(true);
    try{
      await Auth.forgot(email);
      setSent(true);
    }catch(e){ alert(e.message); }
    finally{ setLoading(false); }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Recuperar contraseña</h1>
      {sent ? (
        <p>Si el correo existe, te enviamos un link para restablecer tu contraseña.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="border p-2 w-full rounded" type="email" placeholder="Tu email"
                 value={email} onChange={e=>setEmail(e.target.value)}/>
          <button disabled={loading} className="bg-black text-white px-4 py-2 rounded w-full">
            {loading ? 'Enviando...' : 'Enviar link'}
          </button>
        </form>
      )}
    </main>
  );
}
