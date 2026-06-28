const express = require('express');
const { Evento, Inscripcion, Usuario } = require('../models');

const router = express.Router();

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

router.post('/', async (req, res) => {
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

module.exports = router;
//aaaaa