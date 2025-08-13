'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function CampaignsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name:'', startAt:'', endAt:'', status:'active' });
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  async function load() {
    try {
      const r = await api('/api/campaigns');
      setItems(r.data || r.campaigns || []);
    } catch {
      // fallback mock si backend no está listo
      setItems([
        { _id:'c1', name:'Septiembre IG Stories', status:'active', startAt:'2025-09-01', endAt:'2025-09-30' },
        { _id:'c2', name:'Reviews Google ★4+', status:'active', startAt:'2025-09-10', endAt:'2025-10-15' },
      ]);
    }
  }

  useEffect(()=>{ load(); },[]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (editId) {
        await api(`/api/campaigns/${editId}`, { method:'PUT', body: form });
      } else {
        await api('/api/campaigns', { method:'POST', body: form });
      }
      setForm({ name:'', startAt:'', endAt:'', status:'active' });
      setEditId(null);
      await load();
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  const onEdit = (c) => {
    setEditId(c._id);
    setForm({
      name: c.name || '',
      startAt: c.startAt?.slice(0,10) || '',
      endAt: c.endAt?.slice(0,10) || '',
      status: c.status || 'active',
    });
  };

  return (
    <main className="section section-py">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Campañas</h1>
        <Link href="/rules" className="px-3 py-2 rounded-lg border">Ir a Reglas →</Link>
      </div>

      {/* Formulario */}
      <div className="card mb-6">
        <p className="font-semibold mb-3">{editId ? 'Editar campaña' : 'Nueva campaña'}</p>
        <form onSubmit={onSubmit} className="grid sm:grid-cols-5 gap-3">
          <input className="border rounded-lg px-3 py-2" placeholder="Nombre"
            value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
          <input type="date" className="border rounded-lg px-3 py-2"
            value={form.startAt} onChange={e=>setForm({...form, startAt:e.target.value})}/>
          <input type="date" className="border rounded-lg px-3 py-2"
            value={form.endAt} onChange={e=>setForm({...form, endAt:e.target.value})}/>
          <select className="border rounded-lg px-3 py-2"
            value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
            <option value="active">Activa</option>
            <option value="paused">Pausada</option>
            <option value="draft">Borrador</option>
          </select>
          <button disabled={loading} className="px-3 py-2 rounded-lg bg-pungos-primary text-white">
            {editId ? 'Guardar' : 'Crear'}
          </button>
        </form>
        {error && <p className="text-rose-600 text-sm mt-2">{error}</p>}
      </div>

      {/* Tabla */}
      <div className="card">
        <p className="font-semibold mb-3">Listado</p>
        <div className="overflow-auto border rounded-xl bg-white">
          <table className="min-w-[700px] w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Inicio</th>
                <th className="px-4 py-3 text-left">Fin</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="[&_tr:hover]:bg-slate-50">
              {items.map(c=>(
                <tr key={c._id} className="border-t">
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.status}</td>
                  <td className="px-4 py-3">{c.startAt?.slice(0,10)}</td>
                  <td className="px-4 py-3">{c.endAt?.slice(0,10)}</td>
                  <td className="px-4 py-3">
                    <button onClick={()=>onEdit(c)} className="px-3 py-1.5 border rounded-lg mr-2">Editar</button>
                    <Link href={`/rules?campaignId=${c._id}`} className="px-3 py-1.5 border rounded-lg">Reglas</Link>
                  </td>
                </tr>
              ))}
              {!items.length && (
                <tr><td className="px-4 py-4 text-slate-500" colSpan={5}>Sin campañas aún.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
