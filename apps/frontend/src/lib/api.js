export const API = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export async function api(path, { method='GET', body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { 'Content-Type':'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include', // importante para cookie httpOnly
    cache: 'no-store'
  });
  if (!res.ok) {
    let t = await res.text().catch(()=> '');
    try { t = JSON.parse(t); } catch {}
    throw new Error(typeof t === 'string' ? t : (t?.error || 'Error'));
  }
  return res.json();
}
export const Auth = {
  me: () => api('/api/auth/me'),
  signup: (data) => api('/api/auth/signup', { method:'POST', body:data }),
  login: (data) => api('/api/auth/login', { method:'POST', body:data }),
  logout: () => api('/api/auth/logout', { method:'POST' }),
  forgot: (email) => api('/api/auth/forgot', { method:'POST', body:{ email } }),
  reset: (token, password) => api(`/api/auth/reset/${token}`, { method:'POST', body:{ password } }),
};