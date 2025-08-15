'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

/* ───────────────── helpers ───────────────── */
function cn(...a){ return a.filter(Boolean).join(' '); }

// sparkline muy liviano en SVG
function TrendSpark({ values = [], color = '#2563eb' }) {
  if (!values.length) return null;
  const W = 120, H = 36, max = Math.max(...values), min = Math.min(...values);
  const norm = v => H - ((v - min) / (max - min || 1)) * (H - 6) - 3; // padding 3
  const step = W / (values.length - 1 || 1);
  const d = values.map((v, i) => `${i ? 'L' : 'M'} ${i*step} ${norm(v)}`).join(' ');
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
      <path d={d} fill="none" stroke={color} strokeWidth="2" />
      <circle r="3" cx={W} cy={norm(values[values.length-1])} fill={color} />
    </svg>
  );
}

/* ───────────────── mock api ───────────────── */
const mockFetch = () => new Promise(res => setTimeout(() => res({
  kpis: {
    pendingUGC: 8, couponsToday: 23, estRevenue: 420,
    trendUGC: [3,5,4,6,7,5,8], trendCoupons: [9,11,8,15,14,18,23], trendRevenue: [120,160,140,260,210,330,420]
  },
  recent: [
    { id: 'act1', text: 'UGC aprobado: @maria subió historia IG', time: 'hace 2 min' },
    { id: 'act2', text: 'Cupón canjeado en Sucursal Centro', time: 'hace 7 min' },
    { id: 'act3', text: 'Nueva reseña 5★ en Google', time: 'hace 12 min' },
  ],
  campaigns: [
    { id:'c1', name:'Septiembre IG Stories', status:'Activa', ctr:'4.2%', ends:'30 Sep' },
    { id:'c2', name:'Reviews Google ★4+','status':'Activa', ctr:'6.1%', ends:'15 Oct' },
  ],
  ugcPending: [
    { id:'u101', user:'Ana R.', network:'Instagram', action:'Story + @mención', url:'#', submitted:'09:12' },
    { id:'u102', user:'Luis M.', network:'TikTok', action:'Video + #hashtag', url:'#', submitted:'09:05' },
    { id:'u103', user:'Sofía P.', network:'Google', action:'Reseña 5★', url:'#', submitted:'08:57' },
  ],
  coupons: [
    { code:'PG-2F9K', user:'Carlos M.', value:'-20%', status:'Activo', issued:'08:41', expires:'+7d' },
    { code:'PG-6H2R', user:'Lupita S.', value:'Gratis capuccino', status:'Canjeado', issued:'08:20', expires:'—' },
    { code:'PG-9ZQW', user:'Jorge T.', value:'$100 MXN', status:'Activo', issued:'07:55', expires:'+14d' },
  ],
  perf: { days:['L','M','X','J','V','S','D'], conv:[2,3,2,5,4,6,8] }
}), 450));

/* ───────────────── UI ───────────────── */
function StatCard({ title, value, hint, trend, color='text-pungos-primary' }) {
  const stroke = color.includes('primary') ? '#2563eb' : '#0f172a';
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="card">
      <p className="text-sm text-slate-500">{title}</p>
      <div className="mt-1 flex items-end justify-between">
        <p className="text-3xl font-extrabold">{value}</p>
        <TrendSpark values={trend} color={stroke}/>
      </div>
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </motion.div>
  );
}

function QuickActions() {
  const btn = 'px-3 py-2 rounded-lg border hover:bg-white transition text-sm';
  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/campaigns" className={btn}>➕ Crear campaña</Link>
      <Link href="/rules" className={btn}>🧾 Reglas</Link>
      <Link href="/moderation" className={btn}>🗂️ Revisar UGC</Link>
      <Link href="/redeem" className="px-3 py-2 rounded-lg bg-pungos-primary text-white hover:bg-pungos-primary-700 transition text-sm">📷 Escanear QR</Link>
    </div>
  );
}





function Table({ headers=[], children }) {
  return (
    <div className="overflow-auto border rounded-xl bg-white">
      <table className="min-w-[640px] w-full text-sm">
        <thead className="bg-slate-50">
          <tr>{headers.map(h=> <th key={h} className="text-left font-semibold text-slate-600 px-4 py-3">{h}</th>)}</tr>
        </thead>
        <tbody className="[&_tr:hover]:bg-slate-50">{children}</tbody>
      </table>
    </div>
  );
}

/* ───────────────── page ───────────────── */
export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(()=>{ mockFetch().then(setData); },[]);
  const perfMax = useMemo(()=> data ? Math.max(...data.perf.conv) : 1, [data]);

  const approve = (id)=> { setBusy(true); setTimeout(()=>{ setData(d => ({...d, ugcPending: d.ugcPending.filter(x=>x.id!==id)})); setBusy(false); }, 400); };
  const reject  = (id)=> { setBusy(true); setTimeout(()=>{ setData(d => ({...d, ugcPending: d.ugcPending.filter(x=>x.id!==id)})); setBusy(false); }, 400); };

  if (!data) return <div className="section section-py">Cargando panel…</div>;

  return (
    <main className="section section-py">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Panel</h1>
          <p className="text-slate-600">Resumen de hoy · {new Date().toLocaleDateString()}</p>
        </div>
        <QuickActions />
      </div>

      {/* KPIs */}
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard title="UGC pendientes" value={data.kpis.pendingUGC} trend={data.kpis.trendUGC} hint="por revisar" />
        <StatCard title="Cupones hoy" value={data.kpis.couponsToday} trend={data.kpis.trendCoupons} hint="emitidos" />
        <StatCard title="Ingresos estimados" value={`$ ${data.kpis.estRevenue}`} trend={data.kpis.trendRevenue} hint="MXN" />
      </div>

      {/* Hoy */}
      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        {/* actividad + campañas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <p className="font-semibold mb-3">Hoy</p>
            <ul className="space-y-2">
              {data.recent.map(it=>(
                <li key={it.id} className="flex items-center justify-between">
                  <span className="text-slate-700">{it.text}</span>
                  <span className="text-xs text-slate-400">{it.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <p className="font-semibold mb-3">Campañas activas</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {data.campaigns.map(c=>(
                <div key={c.id} className="rounded-lg border p-4">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-slate-500 mt-1">Estado: {c.status} · CTR {c.ctr} · Fin {c.ends}</p>
                  <div className="mt-3 flex gap-2">
                    <Link href="#" className="px-3 py-1.5 border rounded-lg text-sm">Ver</Link>
                    <Link href="#" className="px-3 py-1.5 border rounded-lg text-sm">Editar</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* UGC pendientes */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold">UGC pendientes</p>
              <Link href="#" className="text-sm text-pungos-primary hover:underline">Ver todo</Link>
            </div>
            <Table headers={['Usuario','Red','Acción','Evidencia','Enviado','Acciones']}>
              {data.ugcPending.map(r=>(
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-3">{r.user}</td>
                  <td className="px-4 py-3">{r.network}</td>
                  <td className="px-4 py-3">{r.action}</td>
                  <td className="px-4 py-3">
                    <a href={r.url} className="text-pungos-primary hover:underline">ver</a>
                  </td>
                  <td className="px-4 py-3">{r.submitted}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button disabled={busy} onClick={()=>approve(r.id)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs disabled:opacity-50">Aprobar</button>
                    <button disabled={busy} onClick={()=>reject(r.id)}  className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs disabled:opacity-50">Rechazar</button>
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        </div>

        {/* columna derecha: performance + cupones */}
        <div className="space-y-6">
          <div className="card">
            <p className="font-semibold mb-3">Performance (conversiones)</p>
            <div className="flex items-end gap-2 h-40">
              {data.perf.conv.map((v,i)=>(
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className="w-6 rounded-t bg-pungos-primary/70"
                    style={{ height: `${(v/perfMax)*120 + 6}px` }}
                    title={`${v}`}
                  />
                  <span className="text-[10px] text-slate-500">{data.perf.days[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold">Cupones emitidos</p>
              <Link href="#" className="text-sm text-pungos-primary hover:underline">Ver todo</Link>
            </div>
            <Table headers={['Código','Usuario','Valor','Estado','Emitido','Expira']}>
              {data.coupons.map(c=>(
                <tr key={c.code} className="border-t">
                  <td className="px-4 py-3 font-mono">{c.code}</td>
                  <td className="px-4 py-3">{c.user}</td>
                  <td className="px-4 py-3">{c.value}</td>
                  <td className={cn('px-4 py-3', c.status==='Activo' ? 'text-emerald-600' : 'text-slate-500')}>{c.status}</td>
                  <td className="px-4 py-3">{c.issued}</td>
                  <td className="px-4 py-3">{c.expires}</td>
                </tr>
              ))}
            </Table>
          </div>
        </div>
      </div>
    </main>
  );
}
