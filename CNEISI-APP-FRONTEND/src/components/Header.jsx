import React from 'react'
import Avatar from './Avatar'
import Logo from './Logo'
import { useApp } from '../context/AppContext'

export default function AppHeader() {
  const { role, currentUser, logout } = useApp()
  const isSuperadmin = role === 'superadmin'
  const isAdmin = role === 'admin' || isSuperadmin

  const profile = {
    name: currentUser?.nombreApellido || 'Nombre',
    role: isSuperadmin ? 'Superadministrador' : isAdmin ? 'Administrador' : 'Participante',
    participant: !isAdmin,
  }

  return (
    <header className="app-header">
      <div className="profile-chip">
        <Avatar participant={profile.participant} />
        <div>
          <strong>{profile.name}</strong>
          <span>{profile.role}</span>
        </div>
      </div>
      <Logo />
      <button className="icon-button menu-button" type="button" onClick={logout} aria-label="Salir">
        ☰
      </button>
    </header>
  )
}
