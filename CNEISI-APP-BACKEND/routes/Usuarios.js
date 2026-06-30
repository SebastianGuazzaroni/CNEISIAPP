const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { Usuario } = require('../models');

const router = express.Router();

const usuarioCreateValidators = [
  body('nombreApellido').trim().notEmpty().withMessage('El nombre es requerido.'),
  body('email').trim().isEmail().withMessage('Email inválido.'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
  body('legajo').trim().isNumeric().withMessage('El legajo debe contener sólo números.'),
];

const usuarioUpdateValidators = [
  param('id').isInt().withMessage('El id debe ser un número.'),
  body('nombreApellido').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío.'),
  body('email').optional().trim().isEmail().withMessage('Email inválido.'),
  body('password').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
  body('legajo').optional().trim().isNumeric().withMessage('El legajo debe contener sólo números.'),
];

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: { exclude: ['password'] } });
    res.json(usuarios);
  } catch (error) {
    console.error('GET /Usuarios error:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
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

router.post('/', usuarioCreateValidators, handleValidation, async (req, res) => {
  try {
    const { nombreApellido, email, password, legajo, rol } = req.body;
    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedName = String(nombreApellido).trim();
    const normalizedLegajo = String(legajo).trim();

    const existing = await Usuario.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { email: normalizedEmail },
          { legajo: normalizedLegajo },
        ],
      },
    });

    if (existing) {
      return res.status(409).json({ message: 'Email o legajo ya registrado.' });
    }

    const usuario = await Usuario.create({
      nombreApellido: normalizedName,
      email: normalizedEmail,
      password,
      legajo: normalizedLegajo,
      rol: rol || 'participant',
    });

    const data = usuario.toJSON();
    delete data.password;

    res.status(201).json(data);
  } catch (error) {
    console.error('POST /Usuarios error:', error);
    res.status(500).json({ message: 'Error al crear usuario.' });
  }
});

router.put('/:id', usuarioUpdateValidators, handleValidation, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { nombreApellido, email, password, legajo, rol } = req.body;
    const updateData = {};

    if (nombreApellido !== undefined) updateData.nombreApellido = String(nombreApellido).trim();
    if (email !== undefined) updateData.email = String(email).trim().toLowerCase();
    if (password !== undefined) updateData.password = password;
    if (legajo !== undefined) updateData.legajo = String(legajo).trim();
    if (rol !== undefined) updateData.rol = rol;

    if (updateData.email || updateData.legajo) {
      const existing = await Usuario.findOne({
        where: {
          id: { [require('sequelize').Op.ne]: req.params.id },
          [require('sequelize').Op.or]: [
            ...(updateData.email ? [{ email: updateData.email }] : []),
            ...(updateData.legajo ? [{ legajo: updateData.legajo }] : []),
          ],
        },
      });
      if (existing) {
        return res.status(409).json({ message: 'Email o legajo ya registrado.' });
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

router.delete('/:id', param('id').isInt().withMessage('El id debe ser un número.'), handleValidation, async (req, res) => {
  try {
    const deleted = await Usuario.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('DELETE /Usuarios/:id error:', error);
    res.status(500).json({ message: 'Error al eliminar usuario.' });
  }
});

module.exports = router;
