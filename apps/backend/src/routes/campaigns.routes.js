import { Router } from 'express';
import Campaign from '../models/Campaign.js';

const router = Router();

// Crear
router.post('/', async (req, res) => {
  try {
    const { name, startAt, endAt, status = 'active', businessId = 'demo-biz' } = req.body || {};
    if (!name || !startAt || !endAt) return res.status(400).json({ ok:false, error:'Faltan campos' });

    const doc = await Campaign.create({
      name,
      startAt: new Date(startAt),
      endAt: new Date(endAt),
      status,
      businessId,
    });
    res.status(201).json({ ok: true, data: doc });
  } catch (e) {
    res.status(500).json({ ok:false, error:e.message });
  }
});

// Listar
router.get('/', async (_req, res) => {
  const list = await Campaign.find().sort({ createdAt: -1 }).lean();
  res.json({ ok: true, data: list });
});

// Actualizar
router.put('/:id', async (req, res) => {
  try {
    const { name, startAt, endAt, status } = req.body || {};
    const update = {};
    if (name) update.name = name;
    if (startAt) update.startAt = new Date(startAt);
    if (endAt) update.endAt = new Date(endAt);
    if (status) update.status = status;

    const doc = await Campaign.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!doc) return res.status(404).json({ ok:false, error:'No encontrado' });
    res.json({ ok: true, data: doc });
  } catch (e) {
    res.status(500).json({ ok:false, error:e.message });
  }
});

export default router;
