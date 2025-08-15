'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_BASE;

export default function UGCQueue() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ businessId:'', campaignId:'', network:'instagram', postUrl:'', username:'', evidenceUrl:'', email:'' });

  async function load() {
    const r = await fetch(`${API}/api/events/pending`, { credentials:'include' });
    const j = await r.json();
    setList(j.data || []);
  }
  useEffect(()=>{ load(); },[]);

  async function submit(e) {
    e.preventDefault();
    const r = await fetch(`${API}/api/events/social`, {
      method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include',
      body: JSON.stringify(form)
    });
    if (!r.ok) return alert('Error registrando UGC');
    setForm({ businessId:'', campaignId:'', network:'instagram', postUrl:'', username:'', evidenceUrl:'', email:'' });
    load();
  }

  async function approve(id, email) {
    const r = await fetch(`${API}/api/events/${id}/approve`, {
      method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include',
      body: JSON.stringify({ email })
    });
    if (!r.ok) return alert('Error al aprobar');
    load();
  }

  async function reject(id) {
    await fetch(`${API}/api/events/${id}/reject`, { method:'POST', credentials:'include' });
    load();
  }

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Revisar UGC</h1>

      <form onSubmit={submit} className="border rounded-lg p-4 bg-white mb-8 grid md:grid-cols-2 gap-3">
        <input placeholder="Business ID" className="border p-2 rounded" value={form.businessId} onChange={e=>setForm(s=>({...s,businessId:e.target.value}))} />
        <input placeholder="Campaign ID" className="border p-2 rounded" value={form.campaignId} onChange={e=>setForm(s=>({...s,campaignId:e.target.value}))} />
        <input placeholder="Post URL" className="border p-2 rounded md:col-span-2" value={form.postUrl} onChange={e=>setForm(s=>({...s,postUrl:e.target.value}))} />
        <input placeholder="Username (opcional)" className="border p-2 rounded" value={form.username} onChange={e=>setForm(s=>({...s,username:e.target.value}))} />
        <input placeholder="Evidencia URL (screenshot)" className="border p-2 rounded" value={form.evidenceUrl} onChange={e=>setForm(s=>({...s,evidenceUrl:e.target.value}))} />
        <input placeholder="Email del cliente para cupón" className="border p-2 rounded" value={form.email} onChange={e=>setForm(s=>({...s,email:e.target.value}))} />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Registrar UGC manual</button>
      </form>

      <div className="grid gap-3">
        {list.map(x=>(
          <div key={x._id} className="border rounded-lg p-4 bg-white">
            <p className="font-semibold">{x.network?.toUpperCase()} — {x.postUrl}</p>
            <p className="text-sm text-gray-500">Detectado: {new Date(x.detectedAt).toLocaleString()}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={()=>approve(x._id, form.email)} className="px-3 py-1 rounded bg-emerald-600 text-white">Aprobar + cupón</button>
              <button onClick={()=>reject(x._id)} className="px-3 py-1 rounded bg-red-600 text-white">Rechazar</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
