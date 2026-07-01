import { NavLink, Outlet } from 'react-router-dom';
import AppHeader from '../Header';

const navItems = [
  { to: '/participant', label: 'Inicio', end: true },
  { to: '/participant/timeline', label: 'Cronograma' },
  { to: '/participant/inscriptions', label: 'Inscripciones' },
];

export default function ParticipantLayout() {
  return (
    <div className="participant-layout">
      <AppHeader />
      <main className="participant-main">
        <Outlet />
      </main>
      <nav className="bottom-nav" aria-label="Navegación participante">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => (isActive ? 'bottom-nav-link active' : 'bottom-nav-link')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
