'use client';
import { useState } from 'react';
import { Auth } from '@/lib/api';
import Link from 'next/link';

const sources = [
  { value:'instagram', label:'Instagram' },
  { value:'tiktok', label:'TikTok' },
  { value:'google', label:'Google' },
  { value:'amigo', label:'Un amigo' },
  { value:'otros', label:'Otros' },
];

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '', email:'', phone:'', password:'', marketingOptIn:false, referralSource:'instagram'
  });
  const [loading, setLoading] = useState(false);

  async function onSubmit(e){
    e.preventDefault();
    setLoading(true);
    try {
      await Auth.signup(form);
      window.location.href = '/profile';
    } catch (e) {
      alert(e.message);
    } finally { setLoading(false); }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Crear cuenta</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="border p-2 w-full rounded" placeholder="Nombre"
               value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
        <input className="border p-2 w-full rounded" placeholder="Email" type="email"
               value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <input className="border p-2 w-full rounded" placeholder="Teléfono"
               value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
        <input className="border p-2 w-full rounded" placeholder="Contraseña" type="password"
               value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
        <div className="flex items-center gap-2">
          <input id="mk" type="checkbox" checked={form.marketingOptIn}
                 onChange={e=>setForm({...form, marketingOptIn:e.target.checked})}/>
          <label htmlFor="mk">Quiero recibir novedades</label>
        </div>
        <div>
          <label className="block text-sm mb-1">¿Cómo te enteraste de Pungos?</label>
          <select className="border p-2 w-full rounded"
                  value={form.referralSource}
                  onChange={e=>setForm({...form, referralSource:e.target.value})}>
            {sources.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <button disabled={loading} className="bg-black text-white px-4 py-2 rounded w-full">
          {loading ? 'Creando...' : 'Crear cuenta'}
        </button>
      </form>
      <p className="mt-3 text-sm">¿Ya tienes cuenta? <Link href="/login" className="underline">Inicia sesión</Link></p>
    </main>
  );
}
