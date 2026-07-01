const express = require('express');
const { body } = require('express-validator');
const { Asistencia, Evento, Inscripcion, Usuario } = require('../models');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/requireRole');
const { handleValidation } = require('../middleware/validate');
const { normalizeRole } = require('../utils/auth');

const router = express.Router();

router.use(auth, requireRole('admin', 'superadmin'));

const manualValidators = [
  body('email').trim().isEmail().withMessage('Email inválido.'),
  body('eventoId').isInt().withMessage('eventoId debe ser un número.'),
  body('confirmar').optional().isBoolean().withMessage('confirmar debe ser booleano.'),
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

router.post('/validar', manualValidators, handleValidation, async (req, res) => {
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

router.post('/manual', manualValidators, handleValidation, async (req, res) => {
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
