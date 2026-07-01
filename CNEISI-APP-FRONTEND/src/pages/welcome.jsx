import React from 'react'
import StatusBar from '../components/StatusBar'
import Logo from '../components/Logo'

export default function WelcomePage({ onLogin, onRegister }) {
  return (
    <main className="login-screen">
      <StatusBar />
      <Logo large />
      <div className="welcome-card">
        <h1>Bienvenido</h1>
        <div className="welcome-actions">
          <button className="primary-button wide-save" type="button" onClick={onLogin}>
            Ingresar
          </button>
          <button className="primary-button wide-save" type="button" onClick={onRegister}>
            Registrarse
          </button>
        </div>
      </div>
      <div className="brand-placeholder" aria-label="Logo placeholder" />
    </main>
  )
}
