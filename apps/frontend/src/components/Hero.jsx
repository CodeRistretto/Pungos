import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Convierte <span className="text-indigo-600">historias y reseñas</span> de tus clientes en
              <span className="text-indigo-600"> ventas y lealtad</span>.
            </h1>
            <p className="mt-4 text-gray-600">
              Crea campañas, recompensa UGC con puntos/cupones y valida canjes con QR. Todo desde un panel simple.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/signup" className="px-5 py-3 rounded bg-black text-white">Comenzar gratis</Link>
              <a href="#como-funciona" className="px-5 py-3 rounded border">Ver cómo funciona</a>
            </div>
            <p className="mt-3 text-xs text-gray-500">Sin tarjeta. Listo en minutos.</p>
          </div>
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-indigo-50">
                <p className="font-semibold">Reglas UGC</p>
                <p className="text-gray-600">Historia IG + @mención → 20 pts</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50">
                <p className="font-semibold">Cupón emitido</p>
                <p className="text-gray-600">-20% • QR listo</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50">
                <p className="font-semibold">Canje</p>
                <p className="text-gray-600">Sucursal Centro • 12:31</p>
              </div>
              <div className="p-3 rounded-lg bg-pink-50">
                <p className="font-semibold">Top fans</p>
                <p className="text-gray-600">+350 pts esta semana</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
