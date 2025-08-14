import jwt from 'jsonwebtoken';

// Firma un JWT (7 días por defecto)
export function sign(payload, expiresIn = '7d') {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

export function verify(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
