const express = require('express')
const { Usuario } = require('../models')

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ message: 'Email y password requeridos' })

    const usuario = await Usuario.findOne({ where: { email } })
    if (!usuario) return res.status(401).json({ message: 'Credenciales inválidas' })

    // NOTE: passwords are stored plaintext in this demo DB
    if (String(usuario.password) !== String(password)) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    const data = usuario.toJSON()
    delete data.password
    res.json(data)
  } catch (error) {
    console.error('POST /Authentications error:', error)
    res.status(500).json({ message: 'Error en autenticación' })
  }
})

module.exports = router
