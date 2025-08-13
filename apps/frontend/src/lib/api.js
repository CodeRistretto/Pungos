export const API = process.env.NEXT_PUBLIC_API_BASE;

export async function api(path, { method = 'GET', body, token, credentials = 'include' } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
    credentials
  });
  if (!res.ok) {
    let t = await res.text().catch(()=> '');
    try { t = JSON.parse(t); } catch {}
    throw new Error(typeof t === 'string' ? t : t?.error || 'Error');
  }
  return res.json();
}

export async function fetchMe() {
  return api('/api/auth/me', { method: 'GET' });
}
