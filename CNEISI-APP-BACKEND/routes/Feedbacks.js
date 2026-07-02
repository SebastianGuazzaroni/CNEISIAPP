const express = require('express');
const { body, param, query } = require('express-validator');
const { Feedback, Evento, Inscripcion, Usuario } = require('../models');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { handleValidation } = require('../middleware/validate');
const { normalizeRole } = require('../utils/auth');
const {
  canSubmitFeedback,
  isValidScore,
  FEEDBACK_QUESTIONS,
} = require('../utils/feedback');

const router = express.Router();

const feedbackCreateValidators = [
  body('eventoId').isInt().withMessage('eventoId es requerido y debe ser un número.'),
  body('respuesta1').custom(isValidScore).withMessage('respuesta1 debe ser un entero entre 0 y 5.'),
  body('respuesta2').custom(isValidScore).withMessage('respuesta2 debe ser un entero entre 0 y 5.'),
  body('respuesta3').custom(isValidScore).withMessage('respuesta3 debe ser un entero entre 0 y 5.'),
  body('respuesta4').custom(isValidScore).withMessage('respuesta4 debe ser un entero entre 0 y 5.'),
  body('respuesta5').custom(isValidScore).withMessage('respuesta5 debe ser un entero entre 0 y 5.'),
];

const feedbackIncludes = [
  { model: Evento, as: 'evento' },
  { model: Usuario, as: 'usuario', attributes: { exclude: ['password'] } },
  { model: Inscripcion, as: 'inscripcion' },
];

router.use(auth);

router.get('/mis', requireRole('participant'), async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      where: { usuarioId: req.user.id },
      include: feedbackIncludes,
      order: [['fechaCreacion', 'DESC']],
    });
    res.json(feedbacks);
  } catch (error) {
    console.error('GET /Feedbacks/mis error:', error);
    res.status(500).json({ message: 'Error al obtener feedbacks' });
  }
});

router.get(
  '/',
  requireRole('admin', 'superadmin'),
  query('eventoId').optional().isInt().withMessage('eventoId debe ser un número.'),
  handleValidation,
  async (req, res) => {
    try {
      const where = {};
      if (req.query.eventoId) {
        where.eventoId = req.query.eventoId;
      }

      const feedbacks = await Feedback.findAll({
        where,
        include: feedbackIncludes,
        order: [['fechaCreacion', 'DESC']],
      });
      res.json(feedbacks);
    } catch (error) {
      console.error('GET /Feedbacks error:', error);
      res.status(500).json({ message: 'Error al obtener feedbacks' });
    }
  },
);

router.get('/preguntas', (_req, res) => {
  res.json(FEEDBACK_QUESTIONS);
});

router.get('/:id', param('id').isInt().withMessage('El id debe ser un número.'), handleValidation, async (req, res) => {
  try {
    const feedback = await Feedback.findByPk(req.params.id, { include: feedbackIncludes });
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback no encontrado' });
    }

    const role = normalizeRole(req.user.rol);
    if (role === 'participant' && feedback.usuarioId !== req.user.id) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    res.json(feedback);
  } catch (error) {
    console.error('GET /Feedbacks/:id error:', error);
    res.status(500).json({ message: 'Error al obtener feedback' });
  }
});

router.post('/', requireRole('participant'), feedbackCreateValidators, handleValidation, async (req, res) => {
  try {
    const { eventoId, respuesta1, respuesta2, respuesta3, respuesta4, respuesta5 } = req.body;

    const evento = await Evento.findByPk(eventoId);
    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    const inscripcion = await Inscripcion.findOne({
      where: { eventoId, usuarioId: req.user.id, estado: 'confirmada' },
    });
    if (!inscripcion) {
      return res.status(403).json({ message: 'Debes tener una inscripción confirmada para dejar feedback.' });
    }

    if (!canSubmitFeedback(evento)) {
      return res.status(403).json({
        message: 'El feedback estará disponible 15 minutos después de finalizado el evento.',
      });
    }

    const existing = await Feedback.findOne({
      where: { eventoId, usuarioId: req.user.id },
    });
    if (existing) {
      return res.status(409).json({ message: 'Ya enviaste feedback para este evento.' });
    }

    const feedback = await Feedback.create({
      eventoId,
      usuarioId: req.user.id,
      inscripcionId: inscripcion.id,
      respuesta1: Number(respuesta1),
      respuesta2: Number(respuesta2),
      respuesta3: Number(respuesta3),
      respuesta4: Number(respuesta4),
      respuesta5: Number(respuesta5),
      fechaCreacion: new Date(),
    });

    const created = await Feedback.findByPk(feedback.id, { include: feedbackIncludes });
    res.status(201).json(created);
  } catch (error) {
    console.error('POST /Feedbacks error:', error);
    res.status(500).json({ message: 'Error al crear feedback' });
  }
});

module.exports = router;
