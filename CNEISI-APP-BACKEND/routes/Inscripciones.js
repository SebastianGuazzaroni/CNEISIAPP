const express = require('express');
const { Evento, Inscripcion, Usuario } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  const inscripciones = await Inscripcion.findAll({
    include: [
      { model: Usuario, as: 'usuario', attributes: { exclude: ['password'] } },
      { model: Evento, as: 'evento' }
    ]
  });

  res.json(inscripciones);
});

router.get('/:id', async (req, res) => {
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
});

router.post('/', async (req, res) => {
  const inscripcion = await Inscripcion.create({
    ...req.body,
    fechaInscripcion: req.body.fechaInscripcion || new Date(),
    estado: req.body.estado || 'confirmada'
  });

  res.status(201).json(inscripcion);
});

module.exports = router;
