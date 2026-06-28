import React from 'react'
import StatusBar from '../components/StatusBar'
import Logo from '../components/Logo'

export default function LoginPage({ loginData, loginError, onChange, onGoogle, onSubmit, onBack }) {
  return (
    <main className="login-screen">
      <StatusBar />
      <Logo large />
      <form className="login-form" onSubmit={onSubmit}>
        <input
          aria-label="Email"
          className={loginError ? 'input-error' : ''}
          placeholder="Email"
          type="email"
          value={loginData.email}
          onChange={(event) => onChange({ ...loginData, email: event.target.value })}
        />
        <input
          aria-label="Contraseña"
          placeholder="Contraseña"
          type="password"
          value={loginData.password}
          onChange={(event) => onChange({ ...loginData, password: event.target.value })}
        />
        {loginError ? <span className="login-error">El correo ingresado no corresponde a un inscripto.</span> : null}
        <button className="forgot-button" type="button">
          ¿Olvidó su contraseña?
        </button>
        <div className="login-actions">
          <button className="primary-button" type="submit">
            Iniciar sesión
          </button>
          <button aria-label="Iniciar con Google" className="google-button" type="button" onClick={onGoogle}>
            G
          </button>
        </div>
        <button className="forgot-button" type="button" onClick={onBack}>
          Volver
        </button>
      </form>
      <div className="brand-placeholder" aria-label="Logo placeholder">
        {/* Aquí se puede insertar el SVG de la universidad */}
      </div>
    </main>
  )
}
