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
      html: `<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Restablecer contraseña</title>
  <style>
    /* Resets básicos */
    body, table, td, a { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
    img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    /* Dark mode (algunos clientes) */
    @media (prefers-color-scheme: dark) {
      .bg { background: #0b0b0d !important; }
      .card { background: #121218 !important; border-color: #232334 !important; }
      .muted, .footer { color: #a3a3b2 !important; }
      .text { color: #ffffff !important; }
      .btn { background: #6366f1 !important; color:#fff !important; }
      .brand { color: #fff !important; }
    }
    /* Mobile */
    @media screen and (max-width: 600px){
      .container { width: 100% !important; }
      .px { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background:#f6f7fb;" class="bg">
  <!-- Preheader (preview en inbox) -->
  <div style="display:none; visibility:hidden; opacity:0; color:transparent; height:0; width:0; overflow:hidden; mso-hide:all;">
    Enlace para restablecer tu contraseña. Expira en 30 minutos.
  </div>

  <table role="presentation" width="100%" bgcolor="#f6f7fb" class="bg">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" class="container" style="max-width:600px; width:600px;">
          <!-- Header / Brand -->
          <tr>
            <td align="left" style="padding: 10px 24px;">
              <a href="https://pungos.app" style="text-decoration:none;">
                <span class="brand" style="font-size:20px; font-weight:800; color:#0f172a;">Pungos</span>
              </a>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td class="px" style="padding: 6px 24px;">
              <table role="presentation" width="100%" class="card" style="background:#ffffff; border:1px solid #e5e7eb; border-radius:14px;">
                <tr>
                  <td style="padding: 28px;">
                    <!-- Título -->
                    <h1 class="text" style="margin:0 0 8px 0; font-size:22px; line-height:1.3; color:#0f172a; font-weight:800;">
                      Restablecer tu contraseña
                    </h1>
                    <p class="muted" style="margin:0; color:#475569; font-size:14px; line-height:1.7;">
                      Hola <strong style="color:#0f172a;">{{name}}</strong>, recibimos una solicitud para cambiar tu contraseña.
                      Si fuiste tú, usa el botón de abajo. Este enlace
                      <strong>caduca en 30 minutos</strong>.
                    </p>

                    <!-- Botón -->
                    <table role="presentation" align="center" style="margin:24px auto 12px auto;">
                      <tr>
                        <td align="center" bgcolor="#111827" class="btn"
                            style="border-radius:10px; background:#111827;">
                          <a href="{{resetUrl}}"
                             style="display:inline-block; padding:12px 22px; color:#ffffff; font-weight:700; font-size:14px; text-decoration:none;">
                            Crear nueva contraseña
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Enlace alternativo -->
                    <p class="muted" style="margin:12px 0 0 0; color:#64748b; font-size:12px; line-height:1.7;">
                      Si el botón no funciona, copia y pega este enlace en tu navegador:
                      <br>
                      <a href="${resetUrl}" style="color:#4f46e5; word-break:break-all;">${resetUrl}</a>
                    </p>

                    <!-- Seguridad -->
                    <table role="presentation" width="100%" style="margin-top:24px;">
                      <tr>
                        <td style="background:#f1f5f9; border-radius:10px; padding:12px 14px;">
                          <p class="muted" style="margin:0; color:#475569; font-size:12px; line-height:1.6;">
                            ¿No solicitaste este cambio? Puedes ignorar este correo.
                            Tu contraseña seguirá siendo la misma.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Firma -->
                    <p class="muted" style="margin:20px 0 0 0; color:#475569; font-size:13px;">
                      — El equipo de <strong style="color:#0f172a;">Pungos</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="px" align="center" style="padding: 18px 24px;">
              <p class="footer" style="margin:0; color:#94a3b8; font-size:12px;">
                Este correo fue enviado a <span style="color:#64748b;">{{email}}</span>.
                Si necesitas ayuda, responde a este mensaje o contáctanos en soporte@pungos.app
              </p>
              <p class="footer" style="margin:6px 0 0 0; color:#94a3b8; font-size:12px;">
                © {{year}} Pungos, Todos los derechos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
    .replace('{{name}}', user.name)
    .replace('{{resetUrl}}', resetUrl)
    .replace('{{email}}', user.email)
    .replace('{{year}}', new Date().getFullYear()) 
    
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