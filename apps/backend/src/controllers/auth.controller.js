import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { sign } from '../utils/jwt.js';

const COOKIE_NAME = 'token';
const isProd = process.env.NODE_ENV === 'production';

function setAuthCookie(res, token) {
  // Para local: secure=false. En prod (https) -> true
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    path: '/',
  });
}

export async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Faltan campos' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email ya registrado' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, roles: ['user'] });

    const token = sign({ id: user._id, roles: user.roles, email: user.email });
    setAuthCookie(res, token);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, roles: user.roles } });
  } catch (e) { next(e); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Faltan credenciales' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Credenciales inválidas' });

    const token = sign({ id: user._id, roles: user.roles, email: user.email });
    setAuthCookie(res, token);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, roles: user.roles } });
  } catch (e) { next(e); }
}

export async function logout(req, res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  });
  res.json({ ok: true });
}

export async function me(req, res) {
  res.json({ user: req.user });
}