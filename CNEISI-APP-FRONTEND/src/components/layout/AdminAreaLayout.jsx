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
    <div className="min-vh-100 d-flex flex-column">
      <AppHeader />
      <nav className="glass-panel d-flex gap-2 px-3 py-2 overflow-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) => `nav-pill-link ${isActive ? 'active' : ''}`}
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <main className="flex-grow-1 p-3">
        <Outlet />
        {isSuperadmin ? (
          <div className="mt-3">
            <Link to="/management" className="btn btn-outline-cneisi">
              Volver al panel
            </Link>
          </div>
        ) : null}
      </main>
    </div>
  );
}
