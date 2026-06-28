import React from 'react'

function getRoleLabel(role) {
  const normalized = String(role || 'participant').trim().toLowerCase()
  if (normalized === 'superadmin') return 'Superadministrador'
  if (normalized === 'admin') return 'Administrador'
  return 'Participante'
}

export default function UserProfile({ user }) {
  if (!user) return null

  return (
    <section className="user-profile">
      <h2>Perfil de usuario</h2>
      <dl>
        <dt>Nombre</dt>
        <dd>{user.nombreApellido || 'Sin nombre'}</dd>
        <dt>Email</dt>
        <dd>{user.email || 'Sin email'}</dd>
        <dt>Rol</dt>
        <dd>{getRoleLabel(user.rol)}</dd>
      </dl>
    </section>
  )
}
