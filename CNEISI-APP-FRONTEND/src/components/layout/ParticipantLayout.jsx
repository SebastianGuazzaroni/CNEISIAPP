import { NavLink, Outlet } from 'react-router-dom';
import AppHeader from '../Header';

const navItems = [
  { to: '/participant', label: 'Inicio', end: true },
  { to: '/participant/timeline', label: 'Cronograma' },
  { to: '/participant/inscriptions', label: 'Inscripciones' },
];

export default function ParticipantLayout() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <AppHeader />
      <main className="flex-grow-1 p-3 pb-5 mb-4">
        <Outlet />
      </main>
      <nav className="bottom-nav" aria-label="Navegación participante">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `nav-pill-link text-center ${isActive ? 'active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
