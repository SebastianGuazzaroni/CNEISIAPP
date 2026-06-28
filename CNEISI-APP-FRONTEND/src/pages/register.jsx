import React, { useState } from 'react'
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

    const nombreApellido = form.nombreApellido.trim()
    const email = form.email.trim()
    const password = form.password
    const legajo = form.legajo.trim()

    if (!nombreApellido || !email || !password || !legajo) {
      setError('Completa todos los campos para registrarte')
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Ingresa un email válido')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (!/^\d+$/.test(legajo)) {
      setError('El legajo debe contener sólo números')
      return
    }

    try {
      const result = await onSubmit(form)
      if (!result || !result.success) {
        setError(result?.message || 'No se pudo registrar usuario')
      } else {
        setError('')
        if (typeof onSuccess === 'function') {
          onSuccess()
        }
      }
    } catch (error) {
      setError(error?.message || 'No se pudo completar el registro')
    }
  }

  return (
    <main className="login-screen">
      <StatusBar />
      <Logo large />
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Registrarse</h1>
        <input
          placeholder="Nombre completo"
          value={form.nombreApellido}
          onChange={(event) => handleChange('nombreApellido', event.target.value)}
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(event) => handleChange('email', event.target.value)}
        />
        <input
          placeholder="Contraseña"
          type="password"
          value={form.password}
          onChange={(event) => handleChange('password', event.target.value)}
        />
        <input
          placeholder="Legajo"
          type="text"
          value={form.legajo}
          onChange={(event) => handleChange('legajo', event.target.value)}
        />
        {error ? <span className="login-error">{error}</span> : null}
        <button className="primary-button" type="submit">
          Crear cuenta
        </button>
        <button className="google-button" type="button" onClick={onGoogle}>
          G
        </button>
        <button className="forgot-button" type="button" onClick={onBack}>
          Volver
        </button>
      </form>
      <div className="brand-placeholder" aria-label="Logo placeholder" />
    </main>
  )
}
