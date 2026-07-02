const express = require('express');
const { body, param } = require('express-validator');
const { Evento, Inscripcion, Usuario } = require('../models');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { handleValidation } = require('../middleware/validate');
const { normalizeRole } = require('../utils/auth');
const { VALID_ESTADOS } = require('../utils/feedback');

const router = express.Router();

// Todas las rutas de inscripciones requieren autenticación.
// Los participantes sólo pueden crear inscripciones con su propio usuario.
router.use(auth);

const inscripcionCreateValidators = [
  body('eventoId').isInt().withMessage('eventoId es requerido y debe ser un número.'),
  body('estado').optional().trim().notEmpty().withMessage('El estado no puede estar vacío.'),
];

const inscripcionUpdateValidators = [
  param('id').isInt().withMessage('El id debe ser un número.'),
  body('estado')
    .trim()
    .notEmpty()
    .withMessage('El estado es requerido.')
    .isIn(VALID_ESTADOS)
    .withMessage(`El estado debe ser uno de: ${VALID_ESTADOS.join(', ')}.`),
];

const ACTIVE_ESTADOS = ['confirmada', 'pendiente'];

function isActiveEstado(estado) {
  return ACTIVE_ESTADOS.includes(estado);
}

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
      include: [
        { model: Evento, as: 'evento' },
        { model: Usuario, as: 'usuario', attributes: { exclude: ['password'] } },
      ],
    });

    res.status(201).json(created);
  } catch (error) {
    console.error('POST /Inscripciones error:', error);
    res.status(500).json({ message: 'Error al crear inscripcion' });
  }
});

router.put(
  '/:id',
  requireRole('admin', 'superadmin'),
  inscripcionUpdateValidators,
  handleValidation,
  async (req, res) => {
    try {
      const inscripcion = await Inscripcion.findByPk(req.params.id, {
        include: [{ model: Evento, as: 'evento' }],
      });

      if (!inscripcion) {
        return res.status(404).json({ message: 'Inscripcion no encontrada' });
      }

      const previousEstado = inscripcion.estado;
      const nextEstado = req.body.estado;

      if (previousEstado === nextEstado) {
        const unchanged = await Inscripcion.findByPk(inscripcion.id, {
          include: [
            { model: Usuario, as: 'usuario', attributes: { exclude: ['password'] } },
            { model: Evento, as: 'evento' },
          ],
        });
        return res.json(unchanged);
      }

      const wasActive = isActiveEstado(previousEstado);
      const willBeActive = isActiveEstado(nextEstado);

      if (!wasActive && willBeActive) {
        if (!inscripcion.evento || inscripcion.evento.cupoDisponible <= 0) {
          return res.status(409).json({ message: 'No hay cupo disponible' });
        }
        await inscripcion.evento.update({
          cupoDisponible: inscripcion.evento.cupoDisponible - 1,
        });
      } else if (wasActive && !willBeActive && inscripcion.evento) {
        await inscripcion.evento.update({
          cupoDisponible: inscripcion.evento.cupoDisponible + 1,
        });
      }

      await inscripcion.update({ estado: nextEstado });

      const updated = await Inscripcion.findByPk(inscripcion.id, {
        include: [
          { model: Usuario, as: 'usuario', attributes: { exclude: ['password'] } },
          { model: Evento, as: 'evento' },
        ],
      });

      res.json(updated);
    } catch (error) {
      console.error('PUT /Inscripciones/:id error:', error);
      res.status(500).json({ message: 'Error al actualizar inscripcion' });
    }
  },
);

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

    if (role !== 'participant' && role !== 'admin' && role !== 'superadmin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    if (isActiveEstado(inscripcion.estado) && inscripcion.evento) {
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
