const express = require('express');
const { body, param, query } = require('express-validator');
const { Asistencia, Evento, Inscripcion, Usuario } = require('../models');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { handleValidation } = require('../middleware/validate');
const { normalizeRole } = require('../utils/auth');

const router = express.Router();

// Todas las rutas de asistencia requieren autenticación y
// sólo son accesibles para administradores o superadministradores.
router.use(auth, requireRole('admin', 'superadmin'));

const manualValidators = [
  body('email').trim().isEmail().withMessage('Email inválido.'),
  body('eventoId').isInt().withMessage('eventoId debe ser un número.'),
  body('confirmar').optional().isBoolean().withMessage('confirmar debe ser booleano.'),
];

const asistenciaUpdateValidators = [
  param('id').isInt().withMessage('El id debe ser un número.'),
  body('fechaRegistro').optional().isISO8601().withMessage('fechaRegistro debe ser una fecha válida.'),
  body('metodo').optional().trim().notEmpty().withMessage('metodo no puede estar vacío.'),
  body('inscrito').optional().isBoolean().withMessage('inscrito debe ser booleano.'),
];

const asistenciaIncludes = [
  { model: Evento, as: 'evento', attributes: ['id', 'titulo', 'tipo'] },
  { model: Usuario, as: 'usuario', attributes: ['id', 'nombreApellido', 'email'] },
];

async function findParticipantByEmail(email) {
  const normalizedEmail = String(email).trim().toLowerCase();
  const usuario = await Usuario.findOne({ where: { email: normalizedEmail } });

  if (!usuario) {
    return { error: { status: 404, message: 'Usuario no encontrado.' } };
  }

  if (normalizeRole(usuario.rol) !== 'participant') {
    return { error: { status: 400, message: 'Solo se puede registrar asistencia de participantes.' } };
  }

  return { usuario };
}

router.use(auth);

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

      const asistencias = await Asistencia.findAll({
        where,
        include: asistenciaIncludes,
        order: [['fechaRegistro', 'DESC']],
      });

      res.json(asistencias);
    } catch (error) {
      console.error('GET /Asistencias error:', error);
      res.status(500).json({ message: 'Error al obtener asistencias' });
    }
  },
);

router.get(
  '/:id',
  requireRole('admin', 'superadmin'),
  param('id').isInt().withMessage('El id debe ser un número.'),
  handleValidation,
  async (req, res) => {
    try {
      const asistencia = await Asistencia.findByPk(req.params.id, { include: asistenciaIncludes });
      if (!asistencia) {
        return res.status(404).json({ message: 'Asistencia no encontrada' });
      }
      res.json(asistencia);
    } catch (error) {
      console.error('GET /Asistencias/:id error:', error);
      res.status(500).json({ message: 'Error al obtener asistencia' });
    }
  },
);

router.put(
  '/:id',
  requireRole('admin', 'superadmin'),
  asistenciaUpdateValidators,
  handleValidation,
  async (req, res) => {
    try {
      const asistencia = await Asistencia.findByPk(req.params.id);
      if (!asistencia) {
        return res.status(404).json({ message: 'Asistencia no encontrada' });
      }

      const updates = {};
      if (req.body.fechaRegistro !== undefined) updates.fechaRegistro = req.body.fechaRegistro;
      if (req.body.metodo !== undefined) updates.metodo = req.body.metodo;
      if (req.body.inscrito !== undefined) updates.inscrito = req.body.inscrito;

      await asistencia.update(updates);
      const updated = await Asistencia.findByPk(asistencia.id, { include: asistenciaIncludes });
      res.json(updated);
    } catch (error) {
      console.error('PUT /Asistencias/:id error:', error);
      res.status(500).json({ message: 'Error al actualizar asistencia' });
    }
  },
);

router.delete(
  '/:id',
  requireRole('admin', 'superadmin'),
  param('id').isInt().withMessage('El id debe ser un número.'),
  handleValidation,
  async (req, res) => {
    try {
      const deleted = await Asistencia.destroy({ where: { id: req.params.id } });
      if (!deleted) {
        return res.status(404).json({ message: 'Asistencia no encontrada' });
      }
      res.status(204).end();
    } catch (error) {
      console.error('DELETE /Asistencias/:id error:', error);
      res.status(500).json({ message: 'Error al eliminar asistencia' });
    }
  },
);

router.post('/validar', requireRole('admin', 'superadmin'), manualValidators, handleValidation, async (req, res) => {
  try {
    const { email, eventoId } = req.body;
    const { usuario, error: userError } = await findParticipantByEmail(email);
    if (userError) {
      return res.status(userError.status).json({ message: userError.message });
    }

    const evento = await Evento.findByPk(eventoId);
    if (!evento) {
      return res.status(404).json({ message: 'Actividad no encontrada.' });
    }

    const existing = await Asistencia.findOne({
      where: { usuarioId: usuario.id, eventoId },
    });
    if (existing) {
      return res.status(409).json({
        message: 'La asistencia ya fue registrada para esta actividad.',
        yaRegistrado: true,
      });
    }

    const inscripcion = await Inscripcion.findOne({
      where: { usuarioId: usuario.id, eventoId },
    });

    res.json({
      valido: true,
      inscrito: Boolean(inscripcion),
      usuario: {
        id: usuario.id,
        nombreApellido: usuario.nombreApellido,
        email: usuario.email,
      },
      evento: {
        id: evento.id,
        titulo: evento.titulo,
      },
    });
  } catch (error) {
    console.error('POST /Asistencias/validar error:', error);
    res.status(500).json({ message: 'Error al validar asistencia.' });
  }
});

router.post('/manual', requireRole('admin', 'superadmin'), manualValidators, handleValidation, async (req, res) => {
  try {
    const { email, eventoId, confirmar = false } = req.body;
    const { usuario, error: userError } = await findParticipantByEmail(email);
    if (userError) {
      return res.status(userError.status).json({ message: userError.message });
    }

    const evento = await Evento.findByPk(eventoId);
    if (!evento) {
      return res.status(404).json({ message: 'Actividad no encontrada.' });
    }

    const existing = await Asistencia.findOne({
      where: { usuarioId: usuario.id, eventoId },
    });
    if (existing) {
      return res.status(409).json({ message: 'La asistencia ya fue registrada para esta actividad.' });
    }

    const inscripcion = await Inscripcion.findOne({
      where: { usuarioId: usuario.id, eventoId },
    });

    if (!inscripcion && !confirmar) {
      return res.status(409).json({
        message: 'El participante no está inscripto en esta actividad.',
        requiresConfirmation: true,
        inscrito: false,
        usuario: {
          id: usuario.id,
          nombreApellido: usuario.nombreApellido,
          email: usuario.email,
        },
      });
    }

    const asistencia = await Asistencia.create({
      usuarioId: usuario.id,
      eventoId,
      fechaRegistro: new Date(),
      inscrito: Boolean(inscripcion),
      metodo: 'manual',
    });

    res.status(201).json({
      message: inscripcion
        ? 'Asistencia registrada correctamente.'
        : 'Asistencia registrada sin inscripción previa.',
      inscrito: Boolean(inscripcion),
      asistencia,
      usuario: {
        id: usuario.id,
        nombreApellido: usuario.nombreApellido,
        email: usuario.email,
      },
      evento: {
        id: evento.id,
        titulo: evento.titulo,
      },
    });
  } catch (error) {
    console.error('POST /Asistencias/manual error:', error);
    res.status(500).json({ message: 'Error al registrar asistencia.' });
  }
});

module.exports = router;
