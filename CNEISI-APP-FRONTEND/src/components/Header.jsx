import React from 'react'
import Avatar from './Avatar'
import Logo from './Logo'

export default function AppHeader({ profile, onLogout }) {
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
      <button className="icon-button menu-button" type="button" onClick={onLogout} aria-label="Salir">
        ☰
      </button>
    </header>
  )
}
