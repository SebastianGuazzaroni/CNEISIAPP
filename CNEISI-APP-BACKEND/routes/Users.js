const express = require('express');
const { Usuario } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  const usuarios = await Usuario.findAll({ attributes: { exclude: ['password'] } });
  res.json(usuarios);
});

router.get('/:id', async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id, {
    attributes: { exclude: ['password'] }
  });

  if (!usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  res.json(usuario);
});

router.post('/', async (req, res) => {
  const usuario = await Usuario.create(req.body);
  const data = usuario.toJSON();
  delete data.password;

  res.status(201).json(data);
});

module.exports = router;
