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
    <header className="app-header glass-panel sticky-top d-grid align-items-center gap-3 px-3 py-2"
      style={{ gridTemplateColumns: '1fr auto 1fr', zIndex: 30 }}
    >
      <div className="d-flex align-items-center gap-3">
        <Avatar participant={role === 'participant'} />
        <div>
          <strong className="d-block">{user?.nombreApellido || 'Usuario'}</strong>
          <span className="small text-secondary">{roleLabels[role]}</span>
        </div>
      </div>
      <Logo />
      <div className="d-flex justify-content-end">
        <button className="btn btn-danger btn-sm" type="button" onClick={logout} aria-label="Salir">
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
