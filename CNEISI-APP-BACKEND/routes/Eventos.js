const express = require('express');
const { Evento } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const eventos = await Evento.findAll();
    res.json(eventos);
  } catch (error) {
    console.error('GET /Eventos error:', error);
    res.status(500).json({ message: 'Error al obtener eventos' });
  }
});

router.get('/:id', async (req, res) => {
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

router.post('/', async (req, res) => {
  try {
    const evento = await Evento.create(req.body);
    res.status(201).json(evento);
  } catch (error) {
    console.error('POST /Eventos error:', error);
    res.status(500).json({ message: 'Error al crear evento' });
  }
});

router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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
