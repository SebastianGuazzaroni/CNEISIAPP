const express = require('express');
const { body, param } = require('express-validator');
const { Evento } = require('../models');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { handleValidation } = require('../middleware/validate');

const router = express.Router();

const eventoCreateValidators = [
  body('titulo').trim().notEmpty().withMessage('El título es requerido.'),
  body('fecha').isISO8601().withMessage('La fecha debe ser una fecha válida.'),
  body('sala').trim().notEmpty().withMessage('La sala es requerida.'),
  body('orador').trim().notEmpty().withMessage('El orador es requerido.'),
  body('cupoMaximo').isInt({ min: 1 }).withMessage('El cupo máximo debe ser un número mayor a 0.'),
  body('cupoDisponible').optional().isInt({ min: 0 }).withMessage('El cupo disponible debe ser un número mayor o igual a 0.'),
  body('descripcion').optional({ nullable: true }).trim(),
];

const eventoUpdateValidators = [
  param('id').isInt().withMessage('El id debe ser un número.'),
  body('titulo').optional().trim().notEmpty().withMessage('El título no puede estar vacío.'),
  body('fecha').optional().isISO8601().withMessage('La fecha debe ser una fecha válida.'),
  body('sala').optional().trim().notEmpty().withMessage('La sala no puede estar vacía.'),
  body('orador').optional().trim().notEmpty().withMessage('El orador no puede estar vacío.'),
  body('cupoMaximo').optional().isInt({ min: 1 }).withMessage('El cupo máximo debe ser un número mayor a 0.'),
  body('cupoDisponible').optional().isInt({ min: 0 }).withMessage('El cupo disponible debe ser un número mayor o igual a 0.'),
  body('descripcion').optional({ nullable: true }).trim(),
];

router.get('/', async (_req, res) => {
  try {
    const eventos = await Evento.findAll();
    res.json(eventos);
  } catch (error) {
    console.error('GET /Eventos error:', error);
    res.status(500).json({ message: 'Error al obtener eventos' });
  }
});

router.get('/:id', param('id').isInt().withMessage('El id debe ser un número.'), handleValidation, async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.params.id);

    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    res.json(evento);
  } catch (error) {
    console.error('GET /Eventos/:id error:', error);
    res.status(500).json({ message: 'Error al obtener evento' });
  }
});

router.post('/', auth, requireRole('superadmin'), eventoCreateValidators, handleValidation, async (req, res) => {
  try {
    const payload = {
      ...req.body,
      cupoDisponible: req.body.cupoDisponible ?? req.body.cupoMaximo,
    };
    const evento = await Evento.create(payload);
    res.status(201).json(evento);
  } catch (error) {
    console.error('POST /Eventos error:', error);
    res.status(500).json({ message: 'Error al crear evento' });
  }
});

router.put('/:id', auth, requireRole('superadmin'), eventoUpdateValidators, handleValidation, async (req, res) => {
  try {
    const [updatedCount] = await Evento.update(req.body, { where: { id: req.params.id } });
    if (!updatedCount) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    const updatedEvento = await Evento.findByPk(req.params.id);
    res.json(updatedEvento);
  } catch (error) {
    console.error('PUT /Eventos/:id error:', error);
    res.status(500).json({ message: 'Error al actualizar evento' });
  }
});

router.delete('/:id', auth, requireRole('superadmin'), param('id').isInt().withMessage('El id debe ser un número.'), handleValidation, async (req, res) => {
  try {
    const deleted = await Evento.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('DELETE /Eventos/:id error:', error);
    res.status(500).json({ message: 'Error al eliminar evento' });
  }
});

module.exports = router;
