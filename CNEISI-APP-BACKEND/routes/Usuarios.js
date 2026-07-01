const express = require('express');
const { body, param } = require('express-validator');
const { Op } = require('sequelize');
const { Usuario, Whitelist } = require('../models');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { handleValidation } = require('../middleware/validate');
const { normalizeRole } = require('../utils/auth');

const router = express.Router();

const usuarioCreateValidators = [
  body('nombreApellido').trim().notEmpty().withMessage('El nombre es requerido.'),
  body('email').trim().isEmail().withMessage('Email inválido.'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
  body('rol').optional().isIn(['participant', 'admin', 'superadmin']).withMessage('Rol inválido.'),
];

const usuarioUpdateValidators = [
  param('id').isInt().withMessage('El id debe ser un número.'),
  body('nombreApellido').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío.'),
  body('email').optional().trim().isEmail().withMessage('Email inválido.'),
  body('password').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
  body('rol').optional().isIn(['participant', 'admin', 'superadmin']).withMessage('Rol inválido.'),
];

router.post('/', usuarioCreateValidators, handleValidation, async (req, res) => {
  try {
    const { nombreApellido, email, password, rol } = req.body;
    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedName = String(nombreApellido).trim();
    const requestedRole = normalizeRole(rol || 'participant');

    if (requestedRole === 'admin') {
      return res.status(403).json({ message: 'No se puede registrar un administrador públicamente.' });
    }

    if (requestedRole === 'superadmin') {
      return res.status(403).json({ message: 'No se puede registrar un superadministrador.' });
    }

    const whitelisted = await Whitelist.findOne({ where: { email: normalizedEmail } });
    if (!whitelisted) {
      return res.status(403).json({ message: 'Email no autorizado. Debe estar en la lista blanca.' });
    }

    const existing = await Usuario.findOne({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(409).json({ message: 'Email ya registrado.' });
    }

    const usuario = await Usuario.create({
      nombreApellido: normalizedName,
      email: normalizedEmail,
      password,
      rol: 'participant',
    });

    const data = usuario.toJSON();
    delete data.password;
    res.status(201).json(data);
  } catch (error) {
    console.error('POST /Usuarios error:', error);
    res.status(500).json({ message: 'Error al crear usuario.' });
  }
});

router.get('/', auth, requireRole('superadmin'), async (_req, res) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: { exclude: ['password'] } });
    res.json(usuarios);
  } catch (error) {
    console.error('GET /Usuarios error:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

router.get('/:id', auth, requireRole('superadmin'), param('id').isInt().withMessage('El id debe ser un número.'), handleValidation, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('GET /Usuarios/:id error:', error);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
});

router.post('/admin', auth, requireRole('superadmin'), usuarioCreateValidators, handleValidation, async (req, res) => {
  try {
    const { nombreApellido, email, password } = req.body;
    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedName = String(nombreApellido).trim();

    const existing = await Usuario.findOne({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(409).json({ message: 'Email ya registrado.' });
    }

    const usuario = await Usuario.create({
      nombreApellido: normalizedName,
      email: normalizedEmail,
      password,
      rol: 'admin',
    });

    const data = usuario.toJSON();
    delete data.password;
    res.status(201).json(data);
  } catch (error) {
    console.error('POST /Usuarios/admin error:', error);
    res.status(500).json({ message: 'Error al crear administrador.' });
  }
});

router.put('/:id', auth, requireRole('superadmin'), usuarioUpdateValidators, handleValidation, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { nombreApellido, email, password, rol } = req.body;
    const updateData = {};

    if (nombreApellido !== undefined) updateData.nombreApellido = String(nombreApellido).trim();
    if (email !== undefined) updateData.email = String(email).trim().toLowerCase();
    if (password !== undefined) updateData.password = password;
    if (rol !== undefined) updateData.rol = normalizeRole(rol);

    if (updateData.email) {
      const existing = await Usuario.findOne({
        where: {
          id: { [Op.ne]: req.params.id },
          email: updateData.email,
        },
      });
      if (existing) {
        return res.status(409).json({ message: 'Email ya registrado.' });
      }
    }

    await usuario.update(updateData);

    const data = usuario.toJSON();
    delete data.password;
    res.json(data);
  } catch (error) {
    console.error('PUT /Usuarios/:id error:', error);
    res.status(500).json({ message: 'Error al actualizar usuario.' });
  }
});

router.delete('/:id', auth, requireRole('superadmin'), param('id').isInt().withMessage('El id debe ser un número.'), handleValidation, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (normalizeRole(usuario.rol) === 'superadmin') {
      return res.status(403).json({ message: 'No se puede eliminar un superadministrador.' });
    }

    await Usuario.destroy({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    console.error('DELETE /Usuarios/:id error:', error);
    res.status(500).json({ message: 'Error al eliminar usuario.' });
  }
});

module.exports = router;
