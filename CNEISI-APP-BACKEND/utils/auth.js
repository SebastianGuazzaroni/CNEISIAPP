const jwt = require('jsonwebtoken');

// Clave secreta para firmar y verificar JWT.
// En producción debe configurarse a través de JWT_SECRET.
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-cneisi';

function signToken(user) {
  // Genera un token JWT con los datos mínimos necesarios para identificar
  // a un usuario y su rol en futuras peticiones.
  return jwt.sign(
    { id: user.id, email: user.email, rol: user.rol || 'participant' },
    JWT_SECRET,
    { expiresIn: '7d' },
  );
}

function verifyToken(token) {
  // Verifica la firma del token y devuelve el payload si es válido.
  return jwt.verify(token, JWT_SECRET);
}

function normalizeRole(rol) {
  // Asegura que el rol siempre se normalice a minúsculas y tenga un valor
  // válido: superadmin, admin o participant.
  const value = String(rol || 'participant').toLowerCase();
  if (value === 'superadmin') return 'superadmin';
  if (value === 'admin') return 'admin';
  return 'participant';
}

module.exports = { signToken, verifyToken, normalizeRole, JWT_SECRET };
