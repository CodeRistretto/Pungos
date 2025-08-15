import { Router } from 'express';
import querystring from 'querystring';

const router = Router();

const SCOPES = [
  'pages_show_list',
  'pages_read_engagement',
  'pages_manage_metadata',
  'instagram_basic'
].join(',');

// GET /api/meta/oauth/start
router.get('/start', (req, res) => {
  const state = encodeURIComponent(req.query.state || 'pungos');
  const params = {
    client_id: process.env.META_APP_ID,
    redirect_uri: process.env.META_REDIRECT_URI,
    scope: SCOPES,
    response_type: 'code',
    state
  };
  const url = `https://www.facebook.com/v20.0/dialog/oauth?${querystring.stringify(params)}`;
  return res.redirect(url);
});

export default router;
