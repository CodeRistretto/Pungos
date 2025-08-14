'use client';
import { useEffect, useMemo, useState } from 'react';
import { Auth } from '@/lib/api';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copyState, setCopyState] = useState('');

  useEffect(() => {
    Auth.me()
      .then((r) => {
        if (!r?.user) {
          window.location.href = '/login';
        } else {
          setUser(r.user);
        }
      })
      .catch(() => (window.location.href = '/login'))
      .finally(() => setLoading(false));
  }, []);

  const initials = useMemo(() => {
    if (!user?.name) return 'PU';
    const parts = user.name.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join('');
  }, [user?.name]);

  async function onLogout() {
    try { await Auth.logout(); } catch {}
    window.location.href = '/login';
  }

  async function copyEmail() {
    if (!user?.email) return;
    try {
      await navigator.clipboard.writeText(user.email);
      setCopyState('¡Copiado!');
      setTimeout(() => setCopyState(''), 1500);
    } catch {
      setCopyState('No se pudo copiar');
      setTimeout(() => setCopyState(''), 1500);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[100svh] bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto p-6 animate-pulse">
          <div className="h-8 w-40 bg-slate-200 rounded mb-4" />
          <div className="h-44 bg-slate-200 rounded-2xl" />
        </div>
      </main>
    );
  }

  if (!user) return null;
  const roleList = Array.isArray(user.roles) ? user.roles : [];

  return (
    <main className="min-h-[100svh] bg-[radial-gradient(70%_55%_at_50%_-10%,#E8F0FF_0%,transparent_60%),linear-gradient(to_bottom,#ffffff,#f8fafc)]">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b bg-white/75 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 shadow-inner shrink-0" />
            <h1 className="font-semibold tracking-tight text-slate-800 truncate">Pungos</h1>
            <span className="hidden sm:inline ml-2 text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 whitespace-nowrap">
              Mi perfil
            </span>
          </div>

          {/* LINKS – visibles en desktop */}
          <nav className="hidden md:flex items-center gap-1.5">
            <HeaderLink href="/dashboard">Dashboard</HeaderLink>
            <HeaderLink href="/campaigns">Campañas</HeaderLink>
            <HeaderLink href="/moderation">Moderación</HeaderLink>
            <HeaderLink href="/rules">Reglas</HeaderLink>
            <HeaderLink href="/redeem">Canjear</HeaderLink>
          </nav>

          <button
            onClick={onLogout}
            className="text-xs sm:text-sm rounded-xl px-3 py-1.5 bg-rose-600 text-white hover:bg-rose-700 active:scale-[.98] transition-all shadow-sm"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-5xl mx-auto p-3 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Profile card */}
          <article className="lg:col-span-2 rounded-2xl border bg-white/90 shadow-sm overflow-hidden">
            {/* banner */}
            <div className="relative">
              <div className="h-24 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500" />
              <div className="px-4 sm:px-6 -mt-10 pb-5">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                  <div className="shrink-0 h-20 w-20 rounded-2xl bg-white ring-4 ring-white shadow grid place-items-center text-xl font-bold text-indigo-600 select-none -mt-2">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2
                      className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 truncate"
                      title={user.name || ''}
                    >
                      {user.name || 'Usuario Pungos'}
                    </h2>

                    {/* Email + copiar */}
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <p
                        className="text-slate-600 truncate flex-1 min-w-0 mr-2 leading-6 h-9 flex items-center"
                        title={user.email || ''}
                      >
                        {user.email || '—'}
                      </p>
                      <button
                        onClick={copyEmail}
                        className="shrink-0 rounded-lg border px-3 h-9 text-sm bg-white hover:bg-slate-50 active:scale-[.98] transition whitespace-nowrap"
                        title="Copiar email"
                      >
                        {copyState || 'Copiar email'}
                      </button>
                    </div>

                    {/* Chips */}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {roleList.length > 0 ? (
                        roleList.map((r, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {r}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-50 text-slate-500 border">
                          Sin roles
                        </span>
                      )}
                      <span
                        className={
                          'text-[11px] font-medium px-2.5 py-1 rounded-full border ' +
                          (user.marketingOptIn
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200')
                        }
                      >
                        {user.marketingOptIn ? 'Marketing: Sí' : 'Marketing: No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* details */}
            <div className="px-4 sm:px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <InfoRow label="Nombre" value={user.name || '—'} />
              <InfoRow label="Email" value={user.email || '—'} />
              <InfoRow label="Teléfono" value={formatPhone(user.phone) || '—'} />
              <InfoRow label="Roles" value={roleList.length ? roleList.join(', ') : '—'} />
              <InfoRow label="Marketing" value={user.marketingOptIn ? 'Sí' : 'No'} />
            </div>
          </article>

          {/* Quick actions */}
          <aside className="rounded-2xl border bg-white/90 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b bg-slate-50/60">
              <h3 className="font-semibold text-slate-800">Acciones rápidas</h3>
              <p className="text-sm text-slate-600">Atajos comunes de tu cuenta</p>
            </div>
            <div className="p-4 flex-1 grid gap-3 content-start">

              {/* Páginas clave de Pungos */}
              <ActionButton href="/dashboard"  label="Dashboard"   desc="Resumen y métricas"        badge="D" />
              <ActionButton href="/campaigns"  label="Campañas"    desc="Gestiona campañas"         badge="C" />
              <ActionButton href="/moderation" label="Moderación"  desc="Revisiones y reportes"     badge="M" />
              <ActionButton href="/rules"      label="Reglas"      desc="Políticas y normas"        badge="R" />
              <ActionButton href="/redeem"     label="Canjear"     desc="Redimir códigos"           badge="$" />

              {/* Cuenta */}
              <ActionButton href="/profile/edit" label="Editar perfil" desc="Actualiza tu nombre y teléfono" badge="E" />
              <ActionButton href="/security"     label="Seguridad"     desc="Gestiona acceso y sesiones"     badge="S" />
              <ActionButton href="/support"      label="Soporte"       desc="¿Necesitas ayuda? Escríbenos"   badge="S" />

              <button
                onClick={onLogout}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200 active:scale-[.98]"
              >
                Cerrar sesión
              </button>
            </div>
          </aside>
        </div>

        <footer className="mt-8 flex items-center justify-center">
          <span className="text-xs text-slate-500">Hecho con <span className="text-rose-500">❤</span> en Pungos</span>
        </footer>
      </section>
    </main>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="rounded-xl border bg-white p-3.5 sm:p-4 flex items-center justify-between">
      <span className="text-xs sm:text-sm text-slate-600 whitespace-nowrap">{label}</span>
      <span className="text-sm font-medium text-slate-900 truncate text-right" title={String(value)}>{value}</span>
    </div>
  );
}

function ActionButton({ href, label, desc, badge }) {
  return (
    <a href={href} className="group rounded-xl border p-4 hover:bg-slate-50 active:scale-[.99] transition flex items-start gap-3">
      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 text-white grid place-items-center text-sm font-bold shadow">
        {badge || label?.[0]?.toUpperCase() || 'P'}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700">{label}</div>
        <div className="text-xs text-slate-600 truncate">{desc}</div>
      </div>
    </a>
  );
}

function HeaderLink({ href, children }) {
  return (
    <a href={href} className="text-sm text-slate-600 hover:text-indigo-700 px-2 py-1 rounded-lg hover:bg-slate-100">
      {children}
    </a>
  );
}

function formatPhone(v) {
  if (!v) return v;
  const s = String(v).replace(/\D/g, '');
  if (s.length === 10) return `(${s.slice(0,3)}) ${s.slice(3,6)}-${s.slice(6)}`;
  if (s.length === 12 && s.startsWith('52')) return `+52 ${s.slice(2,5)} ${s.slice(5,8)} ${s.slice(8)}`;
  return v;
}
