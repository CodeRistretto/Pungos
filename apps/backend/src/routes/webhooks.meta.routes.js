import crypto from 'crypto';
import { Router } from 'express';

const router = Router();

function verifySignature(req) {
  const mode = (process.env.META_MODE || 'demo').toLowerCase();
  if (mode !== 'prod') return true;

  const signature = req.header('X-Hub-Signature-256') || '';
  const secret = process.env.META_APP_SECRET_SIGNING || '';
  if (!signature.startsWith('sha256=') || !secret) return false;

  const expected = signature.slice(7);
  const computed = crypto.createHmac('sha256', secret).update(req.rawBody).digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(computed, 'hex'));
  } catch {
    return false;
  }
}

// GET verify (challenge)
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.status(403).send('Forbidden');
});

// POST eventos
router.post('/', async (req, res) => {
  try {
    if (!verifySignature(req)) return res.status(403).json({ ok:false, error:'Bad signature' });

    // TODO: parsear body real de Meta (entry/changes)
    // Por ahora, acepta y loguea:
    console.log('META EVENT:', JSON.stringify(req.body, null, 2));

    // Aquí puedes normalizar y crear UGCEvent "pending", etc.
    return res.json({ ok:true });
  } catch (e) {
    console.error('META webhook error:', e);
    return res.status(500).json({ ok:false, error:e.message });
  }
});

export default router;
