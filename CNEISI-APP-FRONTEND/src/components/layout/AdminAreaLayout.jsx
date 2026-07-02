import { Link, NavLink, Outlet } from 'react-router-dom';
import AppHeader from '../Header';
import { useAuth } from '../../hooks/useAuth';
import { normalizeRole } from '../../utils/roleUtils';

const tabs = [
  { to: '/scanner', label: 'Escáner', end: true },
  { to: '/scanner/inscripciones', label: 'Inscripciones' },
  { to: '/scanner/asistencias', label: 'Asistencias' },
];

export default function AdminAreaLayout() {
  const { user } = useAuth();
  const isSuperadmin = normalizeRole(user?.rol) === 'superadmin';

  return (
    <div className="scanner-layout">
      <AppHeader />
      <nav className="admin-tabs glass-panel">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) => `admin-tab${isActive ? ' active' : ''}`}
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <main className="admin-main">
        <Outlet />
        {isSuperadmin ? (
          <div className="admin-footer-link">
            <Link to="/management" className="secondary-button">
              Volver al panel
            </Link>
          </div>
        ) : null}
      </main>
    </div>
  );
}
