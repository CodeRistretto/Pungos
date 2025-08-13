'use client';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';

const PAGE_SIZE = 8;

export default function ModerationPage() {
  const [items, setItems] = useState([]);
  const [raw, setRaw] = useState([]);
  const [q, setQ] = useState('');
  const [net, setNet] = useState('all'); // all | instagram | tiktok | google
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [msg, setMsg] = useState('');
  const [page, setPage] = useState(1);
  const [view, setView] = useState(null); // item seleccionado para preview modal

  async function load() {
    setLoading(true);
    try {
      const r = await api('/api/ugc/pending'); // ← backend real
      const list = r.data || r.events || [];
      setRaw(list);
      setItems(list);
    } catch (e) {
      // fallback demo
      const mock = [...Array(14)].map((_,i)=>({
        _id: `demo-${i+1}`,
        user:{ name: ['Ana','Carlos','Lupita','Jorge'][i%4], email:`user${i}@test.com` },
        businessId:'demo-biz',
        network: ['instagram','tiktok','google'][i%3],
        postUrl: 'https://instagram.com/p/abc123',
        postId: `post_${1000+i}`,
        mediaType: 'image',
        evidenceUrl: `https://picsum.photos/seed/ugc-${i}/600/400`,
        detectedAt: new Date(Date.now()-i*3600e3).toISOString(),
        status: 'pending',
      }));
      setRaw(mock);
      setItems(mock);
    }
    setLoading(false);
  }

  useEffect(()=>{ load(); },[]);

  // filtros
  const filtered = useMemo(()=>{
    let r = [...raw];
    if (net !== 'all') r = r.filter(x => x.network === net);
    if (q.trim()) {
      const t = q.toLowerCase();
      r = r.filter(x =>
        (x.user?.name||'').toLowerCase().includes(t) ||
        (x.postId||'').toLowerCase().includes(t) ||
        (x.postUrl||'').toLowerCase().includes(t)
      );
    }
    return r;
  }, [q, net, raw]);

  // paginación
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  useEffect(()=>{ setPage(1); }, [q, net]);

  async function approve(item) {
    setBusyId(item._id);
    setMsg('');
    try {
      await api(`/api/ugc/${item._id}/approve`, { method:'POST', body:{ reason:'ok' } });
      setRaw(prev => prev.filter(x => x._id !== item._id));
      setMsg('✅ UGC aprobado y puntos/cupón asignados.');
    } catch (e) {
      setMsg(`❌ ${e.message || 'Error al aprobar'}`);
    }
    setBusyId(null);
  }

  async function reject(item, reason='contenido no válido') {
    setBusyId(item._id);
    setMsg('');
    try {
      await api(`/api/ugc/${item._id}/reject`, { method:'POST', body:{ reason } });
      setRaw(prev => prev.filter(x => x._id !== item._id));
      setMsg('🛑 UGC rechazado.');
    } catch (e) {
      setMsg(`❌ ${e.message || 'Error al rechazar'}`);
    }
    setBusyId(null);
  }

  return (
    <main className="section section-py">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Revisión de UGC</h1>
        <Link href="/dashboard" className="px-3 py-2 rounded-lg border">← Volver al panel</Link>
      </div>

      {/* Filtros */}
      <div className="card mb-4">
        <div className="grid md:grid-cols-4 gap-3 items-center">
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Buscar por usuario, postId o URL…"
            value={q}
            onChange={e=>setQ(e.target.value)}
          />
          <select className="border rounded-lg px-3 py-2" value={net} onChange={e=>setNet(e.target.value)}>
            <option value="all">Todas las redes</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="google">Google Review</option>
          </select>
          <div className="text-sm text-slate-600 md:col-span-2">
            <b>{filtered.length}</b> pendientes • Página {page} de {totalPages}
          </div>
        </div>
      </div>

      {/* Lista */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading && [...Array(6)].map((_,i)=>(
          <div key={i} className="card animate-pulse h-[220px]" />
        ))}

        {!loading && pageItems.map(item => (
          <UGCCard
            key={item._id}
            item={item}
            onPreview={()=> setView(item)}
            onApprove={()=> approve(item)}
            onReject={()=> reject(item)}
            busy={busyId === item._id}
          />
        ))}

        {!loading && !filtered.length && (
          <div className="col-span-full">
            <div className="card text-center">
              <p className="font-semibold">No hay UGC pendientes.</p>
              <p className="text-slate-500 text-sm">Cuando lleguen evidencias, aparecerán aquí para moderar.</p>
            </div>
          </div>
        )}
      </div>

      {/* paginación */}
      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1.5 border rounded-lg disabled:opacity-50">←</button>
          <span className="text-sm text-slate-600">Página {page} / {totalPages}</span>
          <button disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)} className="px-3 py-1.5 border rounded-lg disabled:opacity-50">→</button>
        </div>
      )}

      {/* mensajes */}
      {msg && <p className="mt-4 text-sm text-slate-600">{msg}</p>}

      {/* modal preview */}
      {view && (
        <PreviewModal item={view} onClose={()=>setView(null)} />
      )}
    </main>
  );
}

/** Tarjeta de un UGC pendiente */
function UGCCard({ item, onPreview, onApprove, onReject, busy }) {
  const badge = {
    instagram: 'bg-pink-50 text-pink-700 border-pink-200',
    tiktok: 'bg-slate-900 text-white border-slate-800',
    google: 'bg-amber-50 text-amber-700 border-amber-200',
  }[item.network] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <div className="card group">
      <div className="flex items-start gap-3">
        <div className={`px-2 py-1 text-xs rounded border ${badge}`}>{item.network}</div>
        <div className="text-xs text-slate-500 ml-auto">{new Date(item.detectedAt).toLocaleString()}</div>
      </div>

      <div className="mt-3">
        <p className="font-semibold">{item.user?.name || 'Usuario'}</p>
        <p className="text-xs text-slate-500">{item.user?.email}</p>
      </div>

      <div className="mt-3 rounded-lg overflow-hidden border bg-slate-50">
        <button onClick={onPreview} className="block w-full hover:opacity-90">
          {/* si es next/image con dominio externo necesitarías configurar next.config; usamos img simple */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.evidenceUrl} alt="evidencia" className="w-full h-44 object-cover" />
        </button>
      </div>

      <div className="flex items-center justify-between mt-3 text-sm">
        <a href={item.postUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
          Ver publicación ↗
        </a>
        <span className="text-slate-500">postId: <span className="font-mono">{item.postId}</span></span>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          disabled={busy}
          onClick={onApprove}
          className="flex-1 px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">
          Aprobar
        </button>
        <button
          disabled={busy}
          onClick={onReject}
          className="flex-1 px-3 py-2 rounded-lg border hover:bg-rose-50 disabled:opacity-50">
          Rechazar
        </button>
      </div>
    </div>
  );
}

/** Modal de preview */
function PreviewModal({ item, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl p-4 max-w-3xl w-full" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold">Evidencia de {item.user?.name}</p>
          <button onClick={onClose} className="px-3 py-1.5 border rounded-lg">Cerrar</button>
        </div>
        <div className="rounded-lg overflow-hidden border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.evidenceUrl} alt="evidencia" className="w-full max-h-[70vh] object-contain bg-slate-50" />
        </div>
        <div className="flex items-center justify-between mt-3 text-sm">
          <a href={item.postUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
            Abrir publicación ↗
          </a>
          <span className="text-slate-500">postId: <span className="font-mono">{item.postId}</span></span>
        </div>
      </div>
    </div>
  );
}
