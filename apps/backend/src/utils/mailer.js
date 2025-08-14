import nodemailer from 'nodemailer';

function bool(v, def=false) {
  if (v === undefined) return def;
  return ['1','true','yes','y'].includes(String(v).toLowerCase());
}

export async function mailer() {
  let host   = process.env.SMTP_HOST || '';
  let port   = Number(process.env.SMTP_PORT || 587);
  let secure = bool(process.env.SMTP_SECURE, port === 465); // 465 => true, 587 => false
  const requireTLS = bool(process.env.SMTP_REQUIRE_TLS, false);
  let user   = process.env.SMTP_USER;
  let pass   = process.env.SMTP_PASS;

  // Si faltan credenciales, usa Ethereal para desarrollo (no tumba el server)
  if (!host || !user || !pass) {
    const test = await nodemailer.createTestAccount();
    host = 'smtp.ethereal.email';
    port = 587;
    secure = false;
    user = test.user;
    pass = test.pass;
    console.log('⚠️  SMTP de prueba (Ethereal) activo.');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,              // true para 465, false para 587
    requireTLS,          // fuerza STARTTLS si estás en 587
    auth: { user, pass },
    connectionTimeout: 15000,
    greetingTimeout:   10000,
    socketTimeout:     20000,
    tls: { servername: host },
  });

  try {
    await transporter.verify();
    console.log(`📮 SMTP listo: ${host}:${port} secure=${secure} requireTLS=${requireTLS}`);
    return transporter;
  } catch (err) {
    console.warn('⚠️  SMTP no verificó. Modo SIMULADO. Motivo:', err?.message);
    return {
      async sendMail(options) {
        console.log('✉️  [SIMULADO] Enviar a:', options.to);
        console.log('Asunto:', options.subject);
        console.log('HTML (preview):', (options.html || '').slice(0, 300) + '...');
        return { messageId: 'simulado', previewUrl: null };
      }
    };
  }
}

export function logPreview(info) {
  try {
    const url = nodemailer.getTestMessageUrl?.(info);
    if (url) console.log('🔎 Preview del email (Ethereal):', url);
  } catch {}
}
