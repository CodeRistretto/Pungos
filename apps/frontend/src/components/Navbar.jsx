'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [logged, setLogged] = useState(false);
  useEffect(() => setLogged(!!localStorage.getItem('token')), []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="section h-14 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-xl text-pungos-ink">Pungos</Link>
        <nav className="flex items-center gap-4 text-sm">
          <a href="/#como-funciona" className="text-slate-600 hover:text-pungos-ink">Cómo funciona</a>
          <a href="/#beneficios" className="text-slate-600 hover:text-pungos-ink">Beneficios</a>
          <a href="/#faq" className="text-slate-600 hover:text-pungos-ink">FAQ</a>
          {logged ? (
            <>
              <Link href="/dashboard" className="btn-primary px-3 py-1">Panel</Link>
              <Link href="/profile" className="btn-ghost px-3 py-1">Perfil</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost px-3 py-1">Login</Link>
              <Link href="/signup" className="btn-primary px-3 py-1">Crear cuenta</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
