import { Router } from 'express';

const router = Router();

/**
 * Callback de OAuth de Meta
 * - Meta redirige aquí después de que el usuario da permisos.
 * - Intercambiamos el "code" por un access_token usando la API de Meta.
 */
router.get('/', async (req, res) => {
  const { code, error, error_description } = req.query;

  if (error) {
    console.error('❌ Error de OAuth Meta:', error, error_description);
    return res.status(400).send('Error en autenticación con Meta');
  }

  if (!code) {
    return res.status(400).send('Falta el parámetro code');
  }

  try {
    // Ejemplo: redirigir al frontend con el código recibido
    // En producción, deberías intercambiarlo por un access_token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/meta-success?code=${code}`);
  } catch (err) {
    console.error('❌ Error en callback de Meta:', err);
    res.status(500).send('Error interno al procesar el callback');
  }
});

export default router;
