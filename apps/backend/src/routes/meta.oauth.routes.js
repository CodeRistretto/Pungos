import { Router } from 'express';
import jwt from 'jsonwebtoken';
import MetaAccount from '../models/MetaAccount.js';
import {
  buildAuthUrl,
  exchangeCodeForToken,
  getUserPages,
  getPageInstagramBusinessId,
  subscribePage
} from '../utils/meta.js';

const router = Router();

const FRONT = (() => {
  // Normaliza FRONTEND_URL a absoluta con https://
  const raw = process.env.FRONTEND_URL || 'https://pungos.com';
  return raw.startsWith('http') ? raw : `https://${raw}`;
})();

// GET /api/meta/oauth/start?businessId=...
router.get('/oauth/start', (req, res) => {
  const state = jwt.sign(
    { businessId: req.query.businessId || null, ts: Date.now() },
    process.env.JWT_SECRET || 'dev',
    { expiresIn: '10m' }
  );
  return res.redirect(buildAuthUrl({ state })); // usa META_APP_ID + META_REDIRECT_URI internamente
});

// ALL /api/meta/oauth/callback
router.all('/oauth/callback', async (req, res) => {
  try {
    // Si el usuario canceló en Meta
    if (req.query?.error) {
      const redirect = new URL('/dashboard/integrations/meta/callback', FRONT);
      redirect.searchParams.set('error', req.query.error);
      if (req.query.error_reason) redirect.searchParams.set('reason', req.query.error_reason);
      if (req.query.error_description) redirect.searchParams.set('desc', req.query.error_description);
      return res.redirect(302, redirect.toString());
    }

    const { code, state } = req.query;
    if (!code) {
      const back = new URL('/dashboard/integrations/meta/callback', FRONT);
      back.searchParams.set('error', 'missing_code');
      return res.redirect(302, back.toString());
    }

    // valida state
    let st = null;
    try { st = jwt.verify(state, process.env.JWT_SECRET || 'dev'); } catch {}
    const businessId = st?.businessId || null;

    // 1) intercambia code por access_token de usuario
    const tokenData = await exchangeCodeForToken(code); // { access_token, token_type, expires_in }
    // 2) páginas administradas por el usuario
    const pages = await getUserPages(tokenData.access_token);
    if (!pages.length) {
      const back = new URL('/dashboard/integrations/meta/callback', FRONT);
      back.searchParams.set('error', 'no_pages');
      return res.redirect(302, back.toString());
    }

    // MVP: toma la primera página
    const page = pages[0]; // { id, name, access_token, ... }

    // 3) intenta obtener IG business id
    const ig = await getPageInstagramBusinessId(page.id, page.access_token);

    // 4) intenta suscribir la página al webhook de Meta (mentions, comments, etc.)
    try { await subscribePage(page.id, page.access_token); } catch {}

    // 5) guarda/actualiza la integración
    await MetaAccount.findOneAndUpdate(
      { pageId: page.id },
      {
        userId: null,               // si tienes auth, guarda el uid del usuario
        businessId,
        platform: ig ? 'instagram' : 'facebook',
        pageId: page.id,
        pageName: page.name,
        igBusinessId: ig?.id || null,
        igUsername: ig?.username || null,
        accessToken: page.access_token, // token de PÁGINA
        subscribed: true
      },
      { upsert: true, new: true }
    );

    // 6) a pantalla de éxito en el frontend
    const ok = new URL('/dashboard/integrations/meta/success', FRONT);
    return res.redirect(302, ok.toString());
  } catch (e) {
    const back = new URL('/dashboard/integrations/meta/callback', FRONT);
    back.searchParams.set('error', 'exchange_failed');
    back.searchParams.set('msg', e.message || 'unknown');
    return res.redirect(302, back.toString());
  }
});

export default router;
