import { Router } from 'express';

const router = Router();

router.get('/callback', async (req, res) => {
  const { code, error } = req.query;
  const rawFront = process.env.FRONTEND_URL || 'https://pungos.com';

  // Normaliza FRONTEND_URL y construye una URL absoluta segura
  let front;
  try {
    // si el env viene sin esquema, añade https://
    const base = rawFront.startsWith('http') ? rawFront : `https://${rawFront}`;
    front = new URL('/auth/meta', base);  // /auth/meta es tu página que mostrará el resultado
    if (error) {
      front.searchParams.set('status', 'error');
      front.searchParams.set('error', String(error));
    } else {
      front.searchParams.set('status', 'connected');
      if (code) front.searchParams.set('code', String(code));
    }
  } catch (e) {
    // Si incluso así falla, devolvemos una página segura con enlace
    return res
      .status(200)
      .send(`<html><body>
        <p>Callback recibido. Abre este enlace:</p>
        <a href="https://pungos.com/auth/meta">https://pungos.com/auth/meta</a>
      </body></html>`);
  }

  // Redirección garantizada con URL absoluta válida
  res.redirect(302, front.toString());
});

export default router;
