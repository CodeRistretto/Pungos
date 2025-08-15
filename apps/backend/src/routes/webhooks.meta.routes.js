import { Router } from 'express';
import MetaWebhookEvent from '../models/MetaWebhookEvent.js';
import { verifyMetaSignature } from '../utils/meta.js';

const router = Router();

// GET verify
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.status(403).send('Forbidden');
});

// POST receive
router.post('/', async (req, res) => {
  try {
    const bodyRaw = req.rawBody || JSON.stringify(req.body);
    const sig = req.get('X-Hub-Signature-256');
    if (!verifyMetaSignature(bodyRaw, sig)) {
      return res.status(401).send('Bad signature');
    }

    const payload = req.body;
    try { await MetaWebhookEvent.create({ object: payload.object, raw: payload, type: guessType(payload) }); } catch {}

    // TODO: transforma en UGCEvent si hay mention/story-mention.
    // Para Instagram "story mention", el evento llega por Instagram Messaging (inbox) si el usuario es público. :contentReference[oaicite:4]{index=4}
    // Aquí: buscar entry[].changes[] y crear UGCEvent -> aplicar reglas -> emitir cupón -> (opcional) responder DM dentro de 24h. :contentReference[oaicite:5]{index=5}

    return res.status(200).send('EVENT_RECEIVED');
  } catch (e) {
    return res.status(500).send('Error');
  }
});

function guessType(p) {
  if (p.object === 'instagram') return 'instagram';
  if (p.object === 'page') return 'page';
  return 'unknown';
}

export default router;
