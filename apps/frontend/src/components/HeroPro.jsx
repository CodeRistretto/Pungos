import Link from 'next/link';
import GlowBackground from '@/components/GlowBackground';
import LottieBlock from '@/components/LottieBlock';

export default function HeroPro() {
  return (
    <section className="relative overflow-hidden">
      <GlowBackground />

      <div className="relative section section-py">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="badge">Pungos • UGC Loyalty</span>
            <h1 className="display mt-3">
              Convierte <span className="text-pungos-primary">historias</span> y{' '}
              <span className="text-pungos-primary">reseñas</span> en{' '}
              <span className="text-pungos-primary">ventas</span> y{' '}
              <span className="text-pungos-primary">lealtad</span>.
            </h1>
            <p className="mt-4 text-slate-600 max-w-xl">
              Lanza campañas, valida UGC con un clic y emite cupones con QR. Métricas claras y panel listo para tu equipo.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/signup" className="btn-primary">Comenzar gratis</Link>
              <a href="#como-funciona" className="btn-ghost">Ver cómo funciona</a>
            </div>
            <p className="mt-2 text-xs text-slate-500">Sin tarjeta • Setup en minutos</p>
          </div>

          <div className="relative">
            <div className="card shadow-soft">
              <div className="grid grid-cols-1 gap-4">
                {/* Lottie de celebración */}
                <LottieBlock src="/lotties/ugc-celebrate.json" className="w-full h-56" />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg p-3 bg-indigo-50">
                    <p className="font-semibold text-slate-900">Regla UGC</p>
                    <p className="text-slate-700">Historia IG + @mención → 20 pts</p>
                  </div>
                  <div className="rounded-lg p-3 bg-emerald-50">
                    <p className="font-semibold text-slate-900">Cupón emitido</p>
                    <p className="text-slate-700">-20% • QR listo</p>
                  </div>
                  <div className="rounded-lg p-3 bg-amber-50">
                    <p className="font-semibold text-slate-900">Canje</p>
                    <p className="text-slate-700">Sucursal Centro • 12:31</p>
                  </div>
                  <div className="rounded-lg p-3 bg-pink-50">
                    <p className="font-semibold text-slate-900">Top fans</p>
                    <p className="text-slate-700">+350 pts esta semana</p>
                  </div>
                </div>
                {/* Lottie de escaneo QR */}
                <LottieBlock src="/lotties/qr-scan.json" className="w-full h-40" />
              </div>
            </div>
            <div
              aria-hidden
              className="absolute -z-10 -top-6 -right-6 w-40 h-40 rounded-full bg-pungos-primary/25 blur-3xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
