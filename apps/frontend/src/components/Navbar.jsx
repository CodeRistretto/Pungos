'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    // si guardas un flag/token en localStorage cuando logueas:
    setLogged(!!localStorage.getItem('token'));
  }, []);

  const item = "px-3 py-2 rounded hover:bg-black/5";
  const cta = "px-3 py-2 rounded bg-black text-white hover:opacity-90";

  return (
    <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-xl">Pungos</Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/#como-funciona" className={item}>Cómo funciona</Link>
          <Link href="/#beneficios" className={item}>Beneficios</Link>
          <Link href="/#faq" className={item}>FAQ</Link>
          {logged ? (
            <>
              <Link href="/dashboard" className={item}>Panel</Link>
              <Link href="/profile" className={item}>Perfil</Link>
              <Link href="/logout" className={cta}>Salir</Link>
            </>
          ) : (
            <>
              <Link href="/login" className={item}>Login</Link>
              <Link href="/signup" className={cta}>Crear cuenta</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
