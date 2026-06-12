const express = require('express');
const { Evento } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  const eventos = await Evento.findAll();
  res.json(eventos);
});

router.get('/:id', async (req, res) => {
  const evento = await Evento.findByPk(req.params.id);

  if (!evento) {
    return res.status(404).json({ message: 'Evento no encontrado' });
  }

  res.json(evento);
});

router.post('/', async (req, res) => {
  const evento = await Evento.create(req.body);
  res.status(201).json(evento);
});

module.exports = router;
