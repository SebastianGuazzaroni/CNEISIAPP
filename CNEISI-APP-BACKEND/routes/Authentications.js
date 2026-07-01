const express = require('express')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Usuario } = require('../models')

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'cneisi_secret_dev_2024'
const JWT_EXPIRES_IN = '8h'

router.post(
  '/',
  [
    body('email').trim().isEmail().withMessage('Email inválido.'),
    body('password').notEmpty().withMessage('La contraseña es requerida.'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const { email, password } = req.body
      const normalizedEmail = String(email).trim().toLowerCase()

      const usuario = await Usuario.findOne({ where: { email: normalizedEmail } })
      if (!usuario) {
        return res.status(401).json({ message: 'Credenciales inválidas' })
      }

      const passwordOk = await bcrypt.compare(String(password), usuario.password)
      if (!passwordOk) {
        return res.status(401).json({ message: 'Credenciales inválidas' })
      }

      const payload = { id: usuario.id, email: usuario.email, rol: usuario.rol }
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

      const data = usuario.toJSON()
      delete data.password

      res.json({ token, user: data })
    } catch (error) {
      console.error('POST /Authentications error:', error)
      res.status(500).json({ message: 'Error en autenticación' })
    }
  }
)

module.exports = router
