import { useAuth } from '../hooks/useAuth';
import { normalizeRole } from '../utils/roleUtils';
import Avatar from './Avatar';
import Logo from './Logo';

const roleLabels = {
  participant: 'Participante',
  admin: 'Administrador',
  superadmin: 'Superadministrador',
};

export default function AppHeader() {
  const { user, logout } = useAuth();
  const role = normalizeRole(user?.rol);

  return (
    <header className="app-header glass-panel">
      <div className="profile-chip">
        <Avatar participant={role === 'participant'} />
        <div>
          <strong>{user?.nombreApellido || 'Usuario'}</strong>
          <span className={`role-badge role-${role}`}>{roleLabels[role]}</span>
        </div>
      </div>
      <Logo />
      <button className="icon-button menu-button" type="button" onClick={logout} aria-label="Salir">
        Salir
      </button>
    </header>
  );
}
