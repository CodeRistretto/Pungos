import Coupon from '../models/Coupon.js';
import qrcode from 'qrcode';
import { mailer } from '../utils/mailer.js';

export async function issueCouponAndEmail({ userId, businessId, template, email }) {
  if (!template) throw new Error('No hay template de cupón');
  const code = Math.random().toString(36).slice(2,10).toUpperCase();
  const payload = { code, b: businessId, exp: Date.now()+1000*60*60*24*7 }; // 7 días
  const qrPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');

  const coupon = await Coupon.create({
    userId, businessId, code, qrPayload, status:'active',
    issuedAt: new Date(), expiresAt: new Date(Date.now()+1000*60*60*24*7)
  });

  // QR PNG (base64) para el correo
  const qr = await qrcode.toDataURL(qrPayload);

  try {
    const t = await mailer();
    await t.sendMail({
      from: '"Pungos" <no-reply@pungos.app>',
      to: email,
      subject: '¡Tu cupón de Pungos!',
      html: `<h2>¡Gracias por participar!</h2>
             <p>Tu código: <b>${code}</b></p>
             <p><img src="${qr}" alt="QR" /></p>`
    });
  } catch (e) {
    console.warn('Email fallo, pero cupón emitido:', e.message);
  }

  return coupon;
}
