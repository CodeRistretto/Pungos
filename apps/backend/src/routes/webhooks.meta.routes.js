import { Router } from 'express';
import MetaWebhookEvent from '../models/MetaWebhookEvent.js';
import { verifyMetaSignature } from '../utils/meta.js';

const router = Router();

/**
 * GET /api/webhooks/meta
 * Verificación: ?hub.mode=subscribe&hub.verify_token=...&hub.challenge=...
 */
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.status(403).send('Forbidden');
});

/**
 * POST /api/webhooks/meta
 * Recepción de eventos. Valida firma y registra el evento.
 */
router.post('/', async (req, res) => {
  try {
    const bodyRaw = req.rawBody || JSON.stringify(req.body); // req.rawBody seteado por middleware
    const sig = req.get('X-Hub-Signature-256');

    const ok = verifyMetaSignature(bodyRaw, sig);
    if (!ok) {
      console.warn('Firma Meta inválida (o modo demo desactivado)');
      return res.status(401).send('Bad signature');
    }

    const payload = req.body;
    // Guarda crudo para depuración
    try {
      await MetaWebhookEvent.create({
        object: payload.object,
        raw: payload,
        type: guessType(payload)
      });
    } catch {}

    // Aquí puedes transformar a tu UGCEvent y lanzar tu lógica MVP:
    // - Si viene "mention" / "feed" en Page o IG → emitir cupón, etc.

    return res.status(200).send('EVENT_RECEIVED');
  } catch (e) {
    console.error('Webhook error', e);
    return res.status(500).send('Error');
  }
});

// Detección simple del tipo
function guessType(payload) {
  if (payload.object === 'instagram') return 'instagram_event';
  if (payload.object === 'page') return 'page_event';
  return 'unknown';
}

export default router;
