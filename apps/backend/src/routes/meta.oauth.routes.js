import { Router } from 'express';
import jwt from 'jsonwebtoken';
import MetaAccount from '../models/MetaAccount.js';
import {
  buildAuthUrl, exchangeCodeForToken, getUserPages,
  getPageInstagramBusinessId, subscribePage
} from '../utils/meta.js';

const router = Router();

/**
 * GET /api/meta/oauth/login?businessId=... (opcional)
 * Redirige al diálogo OAuth de Meta.
 */
router.get('/login', (req, res) => {
  const stateObj = {
    businessId: req.query.businessId || null,
    ts: Date.now()
  };
  const state = jwt.sign(stateObj, process.env.JWT_SECRET || 'dev');
  const url = buildAuthUrl({ state });
  return res.redirect(url);
});

/**
 * GET /api/meta/oauth/callback?code=...
 * Canjea code → access_token, lista páginas,
 * toma la primera página, guarda tokens y (si hay IG) su id.
 */
router.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code) return res.status(400).send('Falta code');

    let stateData = null;
    try {
      stateData = jwt.verify(state, process.env.JWT_SECRET || 'dev');
    } catch {}
    const businessId = stateData?.businessId || null;

    const tokenResp = await exchangeCodeForToken(code);
    const userToken = tokenResp.access_token;

    const pages = await getUserPages(userToken);
    if (!pages.length) {
      return res.status(200).send('Conexión OK, pero no se encontraron páginas.');
    }

    // para MVP tomamos la primera página
    const page = pages[0]; // { id, name, access_token, ... }
    const ig = await getPageInstagramBusinessId(page.id, page.access_token);

    // Opcional: suscribir app a la página
    try { await subscribePage(page.id, page.access_token); } catch { /* ignore MVP */ }

    // Guardar cuenta Meta
    const doc = await MetaAccount.findOneAndUpdate(
      { pageId: page.id },
      {
        userId: null,            // si tienes user en req, colócalo
        businessId,
        platform: ig ? 'instagram' : 'facebook',
        pageId: page.id,
        pageName: page.name,
        igBusinessId: ig?.id || null,
        accessToken: page.access_token,
        subscribed: true,
        scopes: [],              // opcional
      },
      { upsert: true, new: true }
    );

    // Redirige a tu panel con un mensaje simple
    const back = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/integrations?meta=ok`;
    return res.redirect(back);
  } catch (e) {
    console.error('OAuth callback error:', e);
    return res.status(500).send('Error en callback: ' + e.message);
  }
});

export default router;
