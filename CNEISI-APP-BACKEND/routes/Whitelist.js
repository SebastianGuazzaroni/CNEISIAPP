const express = require('express');
const { body, param } = require('express-validator');
const { Op } = require('sequelize');
const { Whitelist } = require('../models');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { handleValidation } = require('../middleware/validate');

const router = express.Router();

router.use(auth, requireRole('superadmin'));

const createValidators = [
  body('email').trim().isEmail().withMessage('Email inválido.'),
  body('nombreApellido').trim().notEmpty().withMessage('El nombre es requerido.'),
];

const updateValidators = [
  param('id').isInt().withMessage('El id debe ser un número.'),
  body('email').optional().trim().isEmail().withMessage('Email inválido.'),
  body('nombreApellido').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío.'),
];

router.get('/', async (req, res) => {
  try {
    const search = String(req.query.search || '').trim().toLowerCase();
    const where = search
      ? {
          [Op.or]: [
            { email: { [Op.like]: `%${search}%` } },
            { nombreApellido: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const entries = await Whitelist.findAll({ where, order: [['nombreApellido', 'ASC']] });
    res.json(entries);
  } catch (error) {
    console.error('GET /Whitelist error:', error);
    res.status(500).json({ message: 'Error al obtener whitelist' });
  }
});

router.get('/:id', param('id').isInt().withMessage('El id debe ser un número.'), handleValidation, async (req, res) => {
  try {
    const entry = await Whitelist.findByPk(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }
    res.json(entry);
  } catch (error) {
    console.error('GET /Whitelist/:id error:', error);
    res.status(500).json({ message: 'Error al obtener registro' });
  }
});

router.post('/', createValidators, handleValidation, async (req, res) => {
  try {
    const email = String(req.body.email).trim().toLowerCase();
    const nombreApellido = String(req.body.nombreApellido).trim();

    const existing = await Whitelist.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email ya existe en la whitelist.' });
    }

    const entry = await Whitelist.create({ email, nombreApellido });
    res.status(201).json(entry);
  } catch (error) {
    console.error('POST /Whitelist error:', error);
    res.status(500).json({ message: 'Error al crear registro' });
  }
});

router.put('/:id', updateValidators, handleValidation, async (req, res) => {
  try {
    const entry = await Whitelist.findByPk(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    const updateData = {};
    if (req.body.email !== undefined) updateData.email = String(req.body.email).trim().toLowerCase();
    if (req.body.nombreApellido !== undefined) {
      updateData.nombreApellido = String(req.body.nombreApellido).trim();
    }

    if (updateData.email) {
      const existing = await Whitelist.findOne({
        where: {
          email: updateData.email,
          id: { [Op.ne]: req.params.id },
        },
      });
      if (existing) {
        return res.status(409).json({ message: 'Email ya existe en la whitelist.' });
      }
    }

    await entry.update(updateData);
    res.json(entry);
  } catch (error) {
    console.error('PUT /Whitelist/:id error:', error);
    res.status(500).json({ message: 'Error al actualizar registro' });
  }
});

router.delete('/:id', param('id').isInt().withMessage('El id debe ser un número.'), handleValidation, async (req, res) => {
  try {
    const deleted = await Whitelist.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('DELETE /Whitelist/:id error:', error);
    res.status(500).json({ message: 'Error al eliminar registro' });
  }
});

module.exports = router;
