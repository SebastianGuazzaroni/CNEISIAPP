const { normalizeRole } = require('../utils/auth');

function requireRole(...roles) {
  const allowed = roles.map((rol) => normalizeRole(rol));

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    // Comprueba que el rol del usuario se encuentre entre los permitidos
    const userRole = normalizeRole(req.user.rol);
    if (!allowed.includes(userRole)) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    next();
  };
}

module.exports = { requireRole };
