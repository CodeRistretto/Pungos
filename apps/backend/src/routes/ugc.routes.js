import { Router } from 'express';
import UGCEvent from '../models/UGCEvent.js';
import Coupon from '../models/Coupon.js';
import { randomCode } from '../utils/codes.js';

const router = Router();

/**
 * GET /api/ugc/pending
 * Lista UGC con status "pending". Filtros opcionales: ?network=instagram|tiktok|google
 */
router.get('/pending', async (req, res) => {
  const { network } = req.query;
  const q = { status: 'pending' };
  if (network && ['instagram', 'tiktok', 'google'].includes(network)) q.network = network;

  const items = await UGCEvent.find(q).sort({ detectedAt: -1 }).lean();
  res.json({ ok: true, data: items });
});

/**
 * POST /api/ugc/:id/approve
 * Marca aprobado + genera cupón simple.
 */
router.post('/:id/approve', async (req, res) => {
  const { id } = req.params;

  const doc = await UGCEvent.findById(id);
  if (!doc) return res.status(404).json({ ok: false, error: 'UGC no encontrado' });
  if (doc.status !== 'pending') return res.status(400).json({ ok: false, error: 'Ya moderado' });

  doc.status = 'approved';
  doc.reason = req.body?.reason || 'aprobado';
  await doc.save();

  // Cupón de ejemplo al aprobar (se puede desactivar si no quieres)
  const coupon = await Coupon.create({
    userEmail: doc.user?.email || '',
    businessId: doc.businessId || 'demo-biz',
    code: randomCode(8),
    type: 'percent',
    value: 20,
    title: 'Cupón por UGC aprobado',
    expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000), // 7 días
  });

  res.json({ ok: true, coupon: { code: coupon.code, value: coupon.value, type: coupon.type } });
});

/**
 * POST /api/ugc/:id/reject
 * Marca rechazado con razón.
 */
router.post('/:id/reject', async (req, res) => {
  const { id } = req.params;
  const reason = req.body?.reason || 'contenido no válido';

  const doc = await UGCEvent.findById(id);
  if (!doc) return res.status(404).json({ ok: false, error: 'UGC no encontrado' });
  if (doc.status !== 'pending') return res.status(400).json({ ok: false, error: 'Ya moderado' });

  doc.status = 'rejected';
  doc.reason = reason;
  await doc.save();

  res.json({ ok: true });
});

export default router;
