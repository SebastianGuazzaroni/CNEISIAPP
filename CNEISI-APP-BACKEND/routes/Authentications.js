const express = require('express');
const { Usuario, Whitelist } = require('../models');
const { signToken, normalizeRole } = require('../utils/auth');

const router = express.Router();

async function isWhitelisted(email) {
  const entry = await Whitelist.findOne({ where: { email: email.toLowerCase() } });
  return Boolean(entry);
}

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y password requeridos' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const usuario = await Usuario.findOne({ where: { email: normalizedEmail } });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    if (String(usuario.password) !== String(password)) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const rol = normalizeRole(usuario.rol);
    if (rol === 'participant') {
      // Los participantes deben estar en la whitelist para poder iniciar sesión.
      const allowed = await isWhitelisted(normalizedEmail);
      if (!allowed) {
        return res.status(403).json({ message: 'Email no autorizado. Contactá al organizador del evento.' });
      }
    }

    const data = usuario.toJSON();
    delete data.password;
    data.rol = rol;

    // Genera el JWT con los datos de usuario necesarios para la sesión.
    const token = signToken(data);
    res.json({ user: data, token });
  } catch (error) {
    console.error('POST /Authentications error:', error);
    res.status(500).json({ message: 'Error en autenticación' });
  }
});

module.exports = router;
