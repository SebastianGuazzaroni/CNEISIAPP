import React, { useState } from 'react'
import { Form, Button, Alert, Container, Card } from 'react-bootstrap'
import StatusBar from '../components/StatusBar'
import Logo from '../components/Logo'

export default function RegisterPage({ onBack, onSubmit, onSuccess, onGoogle }) {
  const [form, setForm] = useState({ nombreApellido: '', email: '', password: '', legajo: '' })
  const [error, setError] = useState('')

  function handleChange(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const { nombreApellido, email, password, legajo } = form
    if (!nombreApellido.trim() || !email.trim() || !password || !legajo.trim()) {
      setError('Completa todos los campos para registrarte')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Ingresa un email válido')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (!/^\d+$/.test(legajo.trim())) {
      setError('El legajo debe contener sólo números')
      return
    }
    try {
      const result = await onSubmit(form)
      if (!result?.success) {
        setError(result?.message || 'No se pudo registrar usuario')
      } else {
        setError('')
        onSuccess?.()
      }
    } catch (err) {
      setError(err?.message || 'No se pudo completar el registro')
    }
  }

  return (
    <main className="login-screen">
      <StatusBar />
      <Logo large />
      <Container className="d-flex justify-content-center">
        <Card className="p-4 w-100" style={{ maxWidth: 380, background: 'transparent', border: 'none' }}>
          <h5 className="mb-3 text-center fw-bold">Registrarse</h5>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                placeholder="Nombre completo"
                value={form.nombreApellido}
                onChange={(e) => handleChange('nombreApellido', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                placeholder="Contraseña"
                type="password"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                placeholder="Legajo"
                type="text"
                value={form.legajo}
                onChange={(e) => handleChange('legajo', e.target.value)}
              />
            </Form.Group>
            {error && (
              <Alert variant="danger" className="py-2 text-center" style={{ fontSize: '0.85rem' }}>
                {error}
              </Alert>
            )}
            <div className="d-flex gap-2 mb-2">
              <Button variant="primary" type="submit" className="flex-grow-1">
                Crear cuenta
              </Button>
              <Button variant="outline-secondary" type="button" onClick={onGoogle} style={{ width: 44 }}>
                G
              </Button>
            </div>
            <Button variant="link" className="w-100 text-muted" type="button" onClick={onBack}>
              Volver
            </Button>
          </Form>
        </Card>
      </Container>
      <div className="brand-placeholder" aria-label="Logo placeholder" />
    </main>
  )
}
