const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { Evento, Inscripcion, Usuario } = require('../models');

const router = express.Router();

const inscripcionCreateValidators = [
  body('eventoId').isInt().withMessage('eventoId es requerido y debe ser un número.'),
  body('usuarioId').optional().isInt().withMessage('usuarioId debe ser un número.'),
  body('estado').optional().trim().notEmpty().withMessage('El estado no puede estar vacío.'),
];

const inscripcionUpdateValidators = [
  param('id').isInt().withMessage('El id debe ser un número.'),
  body('eventoId').optional().isInt().withMessage('eventoId debe ser un número.'),
  body('usuarioId').optional().isInt().withMessage('usuarioId debe ser un número.'),
  body('estado').optional().trim().notEmpty().withMessage('El estado no puede estar vacío.'),
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
    const inscripciones = await Inscripcion.findAll({
      include: [
        { model: Usuario, as: 'usuario', attributes: { exclude: ['password'] } },
        { model: Evento, as: 'evento' }
      ]
    });

    res.json(inscripciones);
  } catch (error) {
    console.error('GET /Inscripciones error:', error);
    res.status(500).json({ message: 'Error al obtener inscripciones' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: { exclude: ['password'] } },
        { model: Evento, as: 'evento' }
      ]
    });

    if (!inscripcion) {
      return res.status(404).json({ message: 'Inscripcion no encontrada' });
    }

    res.json(inscripcion);
  } catch (error) {
    console.error('GET /Inscripciones/:id error:', error);
    res.status(500).json({ message: 'Error al obtener inscripcion' });
  }
});

router.post('/', inscripcionCreateValidators, handleValidation, async (req, res) => {
  try {
    const inscripcion = await Inscripcion.create({
      ...req.body,
      fechaInscripcion: req.body.fechaInscripcion || new Date(),
      estado: req.body.estado || 'confirmada'
    });

    res.status(201).json(inscripcion);
  } catch (error) {
    console.error('POST /Inscripciones error:', error);
    res.status(500).json({ message: 'Error al crear inscripcion' });
  }
});

router.put('/:id', inscripcionUpdateValidators, handleValidation, async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findByPk(req.params.id);
    if (!inscripcion) {
      return res.status(404).json({ message: 'Inscripcion no encontrada' });
    }

    await inscripcion.update(req.body);

    const updated = await Inscripcion.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: { exclude: ['password'] } },
        { model: Evento, as: 'evento' }
      ]
    });

    res.json(updated);
  } catch (error) {
    console.error('PUT /Inscripciones/:id error:', error);
    res.status(500).json({ message: 'Error al actualizar inscripcion' });
  }
});

router.delete('/:id', param('id').isInt().withMessage('El id debe ser un número.'), handleValidation, async (req, res) => {
  try {
    const deleted = await Inscripcion.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Inscripcion no encontrada' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('DELETE /Inscripciones/:id error:', error);
    res.status(500).json({ message: 'Error al eliminar inscripcion' });
  }
});

module.exports = router;