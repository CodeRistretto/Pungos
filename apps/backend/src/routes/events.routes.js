import { Router } from 'express';
import UGCEvent from '../models/UGCEvent.js';
import Coupon from '../models/Coupon.js';
import CouponTemplate from '../models/CouponTemplate.js';
import { issueCouponAndEmail } from '../services/coupons.js';

const router = Router();

/** POST /api/events/social  (registro manual por staff)
 * body: { businessId, campaignId, network:'instagram', postUrl, username, evidenceUrl }
 */
router.post('/social', async (req, res) => {
  const { businessId, campaignId, network, postUrl, username, evidenceUrl } = req.body || {};
  if (!businessId || !campaignId || !network || !postUrl) return res.status(400).json({ ok:false, error:'Faltan campos' });

  // anti-duplicado por URL
  const exist = await UGCEvent.findOne({ businessId, postUrl });
  if (exist) return res.status(409).json({ ok:false, error:'Duplicado' });

  const doc = await UGCEvent.create({
    userId: null,
    businessId,
    network,
    postUrl,
    postId: null,
    mediaType: 'story',
    evidenceUrl: evidenceUrl || null,
    status: 'pending',
    detectedAt: new Date()
  });

  res.json({ ok:true, data: doc });
});

/** GET /api/events/pending?businessId=... */
router.get('/pending', async (req, res) => {
  const q = {};
  if (req.query.businessId) q.businessId = req.query.businessId;
  const rows = await UGCEvent.find({ ...q, status:'pending' }).sort({ detectedAt:-1 }).limit(100).lean();
  res.json({ ok:true, data: rows });
});

/** POST /api/events/:id/approve  (emite cupón) */
router.post('/:id/approve', async (req, res) => {
  const ugc = await UGCEvent.findById(req.params.id);
  if (!ugc) return res.status(404).json({ ok:false, error:'No encontrado' });

  ugc.status = 'approved';
  await ugc.save();

  // para MVP elige un template fijo o por campaignId
  const tpl = await CouponTemplate.findOne({ businessId: ugc.businessId }).lean();
  const cpn = await issueCouponAndEmail({ userId: ugc.userId, businessId: ugc.businessId, template: tpl, email: req.body?.email });

  res.json({ ok:true, coupon: cpn });
});

/** POST /api/events/:id/reject */
router.post('/:id/reject', async (req, res) => {
  const ugc = await UGCEvent.findById(req.params.id);
  if (!ugc) return res.status(404).json({ ok:false, error:'No encontrado' });
  ugc.status = 'rejected';
  ugc.reason = req.body?.reason || '';
  await ugc.save();
  res.json({ ok:true });
});

export default router;
