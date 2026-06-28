const express = require('express');
const { Usuario } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: { exclude: ['password'] } });
    res.json(usuarios);
  } catch (error) {
    console.error('GET /Usuarios error:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('GET /Usuarios/:id error:', error);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nombreApellido, email, password, legajo, rol } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedName = String(nombreApellido || '').trim();
    const normalizedLegajo = String(legajo || '').trim();

    if (!normalizedName || !normalizedEmail || !password || !normalizedLegajo) {
      return res.status(400).json({ message: 'Completa nombre, email, contraseña y legajo.' });
    }

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Email inválido.' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    if (!/^\d+$/.test(normalizedLegajo)) {
      return res.status(400).json({ message: 'El legajo debe contener sólo números.' });
    }

    const existing = await Usuario.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { email: normalizedEmail },
          { legajo: normalizedLegajo },
        ],
      },
    });

    if (existing) {
      return res.status(409).json({ message: 'Email o legajo ya registrado.' });
    }

    const usuario = await Usuario.create({
      nombreApellido: normalizedName,
      email: normalizedEmail,
      password,
      legajo: normalizedLegajo,
      rol: rol || 'participant',
    });

    const data = usuario.toJSON();
    delete data.password;

    res.status(201).json(data);
  } catch (error) {
    console.error('POST /Usuarios error:', error);
    res.status(500).json({ message: 'Error al crear usuario.' });
  }
});

module.exports = router;
