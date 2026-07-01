const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-cneisi';

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, rol: user.rol || 'participant' },
    JWT_SECRET,
    { expiresIn: '7d' },
  );
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function normalizeRole(rol) {
  const value = String(rol || 'participant').toLowerCase();
  if (value === 'superadmin') return 'superadmin';
  if (value === 'admin') return 'admin';
  return 'participant';
}

module.exports = { signToken, verifyToken, normalizeRole, JWT_SECRET };
