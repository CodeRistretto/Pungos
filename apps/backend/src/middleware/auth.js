import { verifyJwt } from '../utils/jwt.js';
import User from '../models/User.js';

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ ok:false, error:'No token' });
    const payload = verifyJwt(token);
    const user = await User.findById(payload.uid).lean();
    if (!user) return res.status(401).json({ ok:false, error:'Invalid token' });
    req.user = { _id: user._id, email: user.email, roles: user.roles, name: user.name };
    next();
  } catch (e) {
    return res.status(401).json({ ok:false, error:'Unauthorized' });
  }
}