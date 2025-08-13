'use client';
import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { api } from '@/lib/api';

export default function RedeemPage() {
  const divId = 'qr-reader';
  const readerRef = useRef(null);
  const [result, setResult] = useState(null);
  const [manual, setManual] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // inicia cámara
  useEffect(() => {
    const start = async () => {
      try {
        readerRef.current = new Html5Qrcode(divId, /* verbose */ false);
        const cameras = await Html5Qrcode.getCameras();
        const camId = cameras?.[0]?.id;
        if (!camId) return;
        await readerRef.current.start(
          camId,
          { fps: 10, qrbox: 250 },
          onScanSuccess,
          onScanError
        );
      } catch (e) {
        console.warn('QR init error', e);
      }
    };
    start();
    return () => {
      try { readerRef.current?.stop().then(()=> readerRef.current?.clear()); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onScanSuccess(decodedText) {
    setManual(decodedText || '');
  }
  function onScanError() { /* noop para evitar spam */ }

  async function redeem(code) {
    if (!code) return;
    setBusy(true); setError(''); setResult(null);
    try {
      const r = await api('/api/redeem', { method:'POST', body:{ code } });
      setResult(r);
    } catch (e) {
      setError(e.message || 'Error al canjear');
    }
    setBusy(false);
  }

  return (
    <main className="section section-py">
      <h1 className="text-2xl font-bold mb-2">Canjear cupón</h1>
      <p className="text-slate-600 mb-4">Escanea el QR o pega el código manualmente.</p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* visor de cámara */}
        <div className="card">
          <div id={divId} className="w-full rounded-lg overflow-hidden border" style={{minHeight: 320}} />
          <p className="text-xs text-slate-500 mt-2">Si no aparece la cámara, permite permisos o usa el ingreso manual.</p>
        </div>

        {/* ingreso manual + resultado */}
        <div className="card">
          <p className="font-semibold mb-2">Código</p>
          <div className="flex gap-2">
            <input className="border rounded-lg px-3 py-2 flex-1 font-mono"
              placeholder="PG-XXXX"
              value={manual}
              onChange={e=>setManual(e.target.value)} />
            <button disabled={busy} onClick={()=>redeem(manual)}
              className="px-3 py-2 rounded-lg bg-pungos-primary text-white">Validar</button>
          </div>

          {result && (
            <div className="mt-4 rounded-lg border p-4 bg-emerald-50">
              <p className="font-semibold text-emerald-700">✅ Cupón válido</p>
              <pre className="text-xs mt-2">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
          {error && (
            <div className="mt-4 rounded-lg border p-4 bg-rose-50">
              <p className="font-semibold text-rose-700">❌ {error}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
