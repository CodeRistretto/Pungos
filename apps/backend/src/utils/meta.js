import crypto from 'crypto';
import fetch from 'node-fetch';

const FB_GRAPH = 'https://graph.facebook.com/v19.0';

export function buildAuthUrl({ state }) {
  const scopes = [
    // mínimos para MVP (ajusta según tu caso)
    'public_profile',
    'pages_read_engagement',
    'pages_manage_metadata',
    'pages_show_list',
    'instagram_basic',
    'instagram_manage_comments',
    'business_management'
  ].join(',');

  const p = new URL('https://www.facebook.com/v19.0/dialog/oauth');
  p.searchParams.set('client_id', process.env.META_APP_ID);
  p.searchParams.set('redirect_uri', process.env.META_REDIRECT_URI);
  p.searchParams.set('scope', scopes);
  p.searchParams.set('response_type', 'code');
  if (state) p.searchParams.set('state', state);
  return p.toString();
}

export async function exchangeCodeForToken(code) {
  const u = new URL(`${FB_GRAPH}/oauth/access_token`);
  u.searchParams.set('client_id', process.env.META_APP_ID);
  u.searchParams.set('client_secret', process.env.META_APP_SECRET);
  u.searchParams.set('redirect_uri', process.env.META_REDIRECT_URI);
  u.searchParams.set('code', code);

  const r = await fetch(u);
  if (!r.ok) throw new Error(`Token exchange failed: ${r.status}`);
  return r.json(); // { access_token, token_type, expires_in }
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
  u.searchParams.set('fields', 'instagram_business_account{name,id}');
  u.searchParams.set('access_token', pageAccessToken);
  const r = await fetch(u);
  if (!r.ok) return null;
  const j = await r.json();
  return j.instagram_business_account || null;
}

export async function subscribePage(pageId, pageAccessToken) {
  // suscribe la app a eventos de página
  const u = new URL(`${FB_GRAPH}/${pageId}/subscribed_apps`);
  u.searchParams.set('subscribed_fields', 'feed,mention');
  u.searchParams.set('access_token', pageAccessToken);

  const r = await fetch(u, { method: 'POST' });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`subscribePage failed: ${r.status} ${t}`);
  }
  return r.json();
}

export function verifyMetaSignature(reqBody, signatureHeader) {
  // firma: X-Hub-Signature-256: sha256=...
  if (process.env.META_MODE === 'demo') return true;
  if (!signatureHeader) return false;

  const [algo, hash] = signatureHeader.split('=');
  if (algo !== 'sha256' || !hash) return false;

  const hmac = crypto.createHmac('sha256', process.env.META_APP_SECRET_SIGNING);
  const digest = hmac.update(reqBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(digest));
}
