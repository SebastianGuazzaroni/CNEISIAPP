const express = require('express');
const { body, param } = require('express-validator');
const { Evento, Inscripcion, Usuario } = require('../models');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { handleValidation } = require('../middleware/validate');
const { normalizeRole } = require('../utils/auth');

const router = express.Router();

const inscripcionCreateValidators = [
  body('eventoId').isInt().withMessage('eventoId es requerido y debe ser un número.'),
  body('estado').optional().trim().notEmpty().withMessage('El estado no puede estar vacío.'),
];

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const role = normalizeRole(req.user.rol);
    const where = role === 'participant' ? { usuarioId: req.user.id } : {};

    const inscripciones = await Inscripcion.findAll({
      where,
      include: [
        { model: Usuario, as: 'usuario', attributes: { exclude: ['password'] } },
        { model: Evento, as: 'evento' },
      ],
    });

    res.json(inscripciones);
  } catch (error) {
    console.error('GET /Inscripciones error:', error);
    res.status(500).json({ message: 'Error al obtener inscripciones' });
  }
});

router.get('/:id', param('id').isInt().withMessage('El id debe ser un número.'), handleValidation, async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: { exclude: ['password'] } },
        { model: Evento, as: 'evento' },
      ],
    });

    if (!inscripcion) {
      return res.status(404).json({ message: 'Inscripcion no encontrada' });
    }

    const role = normalizeRole(req.user.rol);
    if (role === 'participant' && inscripcion.usuarioId !== req.user.id) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    res.json(inscripcion);
  } catch (error) {
    console.error('GET /Inscripciones/:id error:', error);
    res.status(500).json({ message: 'Error al obtener inscripcion' });
  }
});

router.post('/', requireRole('participant'), inscripcionCreateValidators, handleValidation, async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.body.eventoId);
    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    if (evento.cupoDisponible <= 0) {
      return res.status(409).json({ message: 'No hay cupo disponible' });
    }

    const existing = await Inscripcion.findOne({
      where: { eventoId: req.body.eventoId, usuarioId: req.user.id },
    });
    if (existing) {
      return res.status(409).json({ message: 'Ya estás inscripto en este evento.' });
    }

    const inscripcion = await Inscripcion.create({
      eventoId: req.body.eventoId,
      usuarioId: req.user.id,
      fechaInscripcion: new Date(),
      estado: req.body.estado || 'confirmada',
    });

    await evento.update({ cupoDisponible: evento.cupoDisponible - 1 });

    const created = await Inscripcion.findByPk(inscripcion.id, {
      include: [{ model: Evento, as: 'evento' }],
    });

    res.status(201).json(created);
  } catch (error) {
    console.error('POST /Inscripciones error:', error);
    res.status(500).json({ message: 'Error al crear inscripcion' });
  }
});

router.delete('/:id', param('id').isInt().withMessage('El id debe ser un número.'), handleValidation, async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findByPk(req.params.id, {
      include: [{ model: Evento, as: 'evento' }],
    });

    if (!inscripcion) {
      return res.status(404).json({ message: 'Inscripcion no encontrada' });
    }

    const role = normalizeRole(req.user.rol);
    if (role === 'participant' && inscripcion.usuarioId !== req.user.id) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    if (role !== 'participant' && role !== 'superadmin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    if (inscripcion.evento) {
      await inscripcion.evento.update({
        cupoDisponible: inscripcion.evento.cupoDisponible + 1,
      });
    }

    await inscripcion.destroy();
    res.status(204).end();
  } catch (error) {
    console.error('DELETE /Inscripciones/:id error:', error);
    res.status(500).json({ message: 'Error al eliminar inscripcion' });
  }
});

module.exports = router;
