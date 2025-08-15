const FB_GRAPH = 'https://graph.facebook.com/v20.0';

export function buildAuthUrl({ state }) {
  const scopes = [
    'public_profile',
    'pages_show_list',
    'pages_read_engagement',
    'instagram_basic',
    'instagram_manage_insights'
  ].join(',');
  const u = new URL('https://www.facebook.com/v20.0/dialog/oauth');
  u.searchParams.set('client_id', process.env.META_APP_ID);
  u.searchParams.set('redirect_uri', process.env.META_REDIRECT_URI);
  u.searchParams.set('scope', scopes);
  u.searchParams.set('response_type', 'code');
  if (state) u.searchParams.set('state', state);
  return u.toString();
}

export async function exchangeCodeForToken(code) {
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID,
    client_secret: process.env.META_APP_SECRET,
    redirect_uri: process.env.META_REDIRECT_URI,
    code
  });
  const url = `${FB_GRAPH}/oauth/access_token?${params.toString()}`;
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status} ${text}`);
  return JSON.parse(text); // { access_token, token_type, expires_in }
}

export async function getUserPages(userAccessToken) {
  const u = new URL(`${FB_GRAPH}/me/accounts`);
  u.searchParams.set('access_token', userAccessToken);
  const r = await fetch(u);
  if (!r.ok) throw new Error('getUserPages failed');
  const j = await r.json();
  return j.data || [];
}

export async function getPageInstagramBusinessId(pageId, pageAccessToken) {
  const u = new URL(`${FB_GRAPH}/${pageId}`);
  u.searchParams.set('fields', 'instagram_business_account{username,id}');
  u.searchParams.set('access_token', pageAccessToken);
  const r = await fetch(u);
  if (!r.ok) return null;
  const j = await r.json();
  return j.instagram_business_account || null;
}

export async function subscribePage(pageId, pageAccessToken) {
  // Suscribe app a eventos de Page. Para IG, la suscripción es vía panel Webhooks (Instagram).
  const u = new URL(`${FB_GRAPH}/${pageId}/subscribed_apps`);
  u.searchParams.set('subscribed_fields', 'feed,mention');
  u.searchParams.set('access_token', pageAccessToken);
  const r = await fetch(u, { method: 'POST' });
  const t = await r.text();
  if (!r.ok) throw new Error(`subscribePage failed: ${r.status} ${t}`);
  return JSON.parse(t);
}

import crypto from 'crypto';
export function verifyMetaSignature(reqBody, signatureHeader) {
  if (process.env.META_MODE === 'demo') return true;
  if (!signatureHeader) return false;
  const [algo, hash] = signatureHeader.split('=');
  if (algo !== 'sha256' || !hash) return false;
  const hmac = crypto.createHmac('sha256', process.env.META_APP_SECRET_SIGNING);
  const digest = hmac.update(reqBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(digest));
}
