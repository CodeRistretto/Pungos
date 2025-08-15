import { Router } from 'express';
import jwt from 'jsonwebtoken';
import MetaAccount from '../models/MetaAccount.js';
import { buildAuthUrl, exchangeCodeForToken, getUserPages, getPageInstagramBusinessId, subscribePage } from '../utils/meta.js';

const router = Router();

// GET /api/meta/oauth/start?businessId=...
router.get('/oauth/start', (req, res) => {
  const state = jwt.sign({ businessId: req.query.businessId || null, ts: Date.now() }, process.env.JWT_SECRET || 'dev');
  return res.redirect(buildAuthUrl({ state }));
});

// ALL /api/meta/oauth/callback
router.all('/oauth/callback', async (req, res) => {
  try {
    if (req.query?.error) {
      const redirect = `${process.env.FRONTEND_URL || 'https://pungos.com'}/integrations/meta/callback` +
        `?error=${encodeURIComponent(req.query.error)}` +
        `&reason=${encodeURIComponent(req.query.error_reason || '')}` +
        `&desc=${encodeURIComponent(req.query.error_description || '')}`;
      return res.redirect(302, redirect);
    }

    const { code, state } = req.query;
    if (!code) return res.redirect(`${process.env.FRONTEND_URL || 'https://pungos.com'}/integrations/meta/callback?error=missing_code`);

    let st = null; try { st = jwt.verify(state, process.env.JWT_SECRET || 'dev'); } catch {}
    const businessId = st?.businessId || null;

    const tokenData = await exchangeCodeForToken(code);            // user token corto
    const pages = await getUserPages(tokenData.access_token);      // páginas del usuario
    if (!pages.length) {
      return res.redirect(`${process.env.FRONTEND_URL || ''}/integrations/meta/callback?error=no_pages`);
    }

    // Tomamos la primera página (MVP)
    const page = pages[0]; // { id, name, access_token, ... }
    const ig = await getPageInstagramBusinessId(page.id, page.access_token);
    try { await subscribePage(page.id, page.access_token); } catch {}

    await MetaAccount.findOneAndUpdate(
      { pageId: page.id },
      {
        userId: null, // si tienes req.user, úsalo
        businessId,
        platform: ig ? 'instagram' : 'facebook',
        pageId: page.id,
        pageName: page.name,
        igBusinessId: ig?.id || null,
        igUsername: ig?.username || null,
        accessToken: page.access_token,
        subscribed: true
      },
      { upsert: true, new: true }
    );

    return res.redirect(`${process.env.FRONTEND_URL || ''}/integrations/meta/success`);
  } catch (e) {
    return res.redirect(`${process.env.FRONTEND_URL || ''}/integrations/meta/callback?error=exchange_failed&msg=${encodeURIComponent(e.message)}`);
  }
});

export default router;
