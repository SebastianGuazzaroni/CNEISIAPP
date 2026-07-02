const { verifyToken, normalizeRole } = require('../utils/auth');

function auth(req, res, next) {
  // Extrae el token Bearer del header Authorization
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  try {
    // Verifica el JWT y construye el objeto de usuario en la request
    const payload = verifyToken(token);
    req.user = {
      id: payload.id,
      email: payload.email,
      rol: normalizeRole(payload.rol),
    };
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

function optionalAuth(req, _res, next) {
  // Intenta verificar un token si existe, pero no falla si no hay token.
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (token) {
    try {
      const payload = verifyToken(token);
      req.user = {
        id: payload.id,
        email: payload.email,
        rol: normalizeRole(payload.rol),
      };
    } catch {
      req.user = null;
    }
  }

  next();
}

module.exports = { auth, optionalAuth };
