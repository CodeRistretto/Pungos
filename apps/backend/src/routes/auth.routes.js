import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import { sign } from '../utils/jwt.js';
import { mailer, logPreview } from '../utils/mailer.js';


const router = Router();

// helper para setear cookie httpOnly
function sendTokenCookie(res, user) {
  const token = sign({ uid: user._id, roles: user.roles });
  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // en prod: true si usas HTTPS
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 días
  });
}

router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password, marketingOptIn = false, referralSource = 'otros' } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ ok:false, error:'Faltan campos' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ ok:false, error:'El email ya está registrado' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, passwordHash, marketingOptIn, referralSource, roles:['user'] });

    sendTokenCookie(res, user);
    res.status(201).json({ ok:true, user:{ _id:user._id, name:user.name, email:user.email, roles:user.roles } });
  } catch (e) {
    res.status(500).json({ ok:false, error:e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ ok:false, error:'Credenciales inválidas' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ ok:false, error:'Credenciales inválidas' });

    sendTokenCookie(res, user);
    res.json({ ok:true, user:{ _id:user._id, name:user.name, email:user.email, roles:user.roles } });
  } catch (e) {
    res.status(500).json({ ok:false, error:e.message });
  }
});

router.post('/logout', async (_req, res) => {
  res.clearCookie('token', { httpOnly:true, sameSite:'lax' });
  res.json({ ok:true });
});

router.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(200).json({ ok:true, user:null });
    // validación ligera: si token inválido, no romper
    let user = null;
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      user = await User.findById(payload.uid).select('name email roles phone marketingOptIn referralSource').lean();
    } catch {}
    res.json({ ok:true, user: user || null });
  } catch (e) {
    res.json({ ok:true, user:null });
  }
});

// Forgot password (envía email con link)
router.post('/forgot', async (req, res) => {
  const { email } = req.body || {};
  const user = await User.findOne({ email });
  if (!user) return res.json({ ok: true }); // no revelar

  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExp = new Date(Date.now() + 30 * 60 * 1000); // 30 min
  await user.save();

  const t = await mailer();
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset/${token}`;

  try {
    const info = await t.sendMail({
      from: '"Pungos" <no-reply@pungos.app>',
      to: user.email,
      subject: 'Restablecer contraseña',
      html: `<p>Hola ${user.name},</p>
             <p>Haz click para restablecer tu contraseña:</p>
             <p><a href="${resetUrl}">${resetUrl}</a></p>
             <p>Caduca en 30 minutos.</p>`
    });
    logPreview(info); // si es Ethereal, imprime preview URL
  } catch (err) {
    console.warn('⚠️  Falló el envío real. Modo SIMULADO. Motivo:', err?.message);
    console.log('➡️  Enlace manual de reset:', resetUrl);
  }

  res.json({ ok: true });
});

// Reset
router.post('/reset/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body || {};

  const user = await User.findOne({ resetToken: token, resetTokenExp: { $gt: new Date() } });
  if (!user) return res.status(400).json({ ok:false, error:'Token inválido o vencido' });

  user.passwordHash = await bcrypt.hash(password, 10);
  user.resetToken = null;
  user.resetTokenExp = null;
  await user.save();

  res.json({ ok:true });
});

export default router;