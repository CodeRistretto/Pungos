import jwt from 'jsonwebtoken';

export function sign(payload, expiresIn = '7d') {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}