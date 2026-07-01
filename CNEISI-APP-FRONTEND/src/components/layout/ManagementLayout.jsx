import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../Logo';

const navItems = [
  { to: '/management', label: 'Overview', end: true },
  { to: '/management/whitelist', label: 'Lista Blanca' },
  { to: '/management/admins', label: 'Administradores' },
  { to: '/management/activities', label: 'Actividades' },
  { to: '/management/metrics', label: 'Métricas' },
];

const externalItems = [{ to: '/scanner', label: 'Escáner QR' }];

function SidebarContent({ onClose }) {
  const { logout } = useAuth();

  return (
    <div className="management-sidebar-inner">
      <div className="management-sidebar-brand">
        <Logo />
        <span>CNEISI Admin</span>
        {onClose ? (
          <button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar menú">
            ✕
          </button>
        ) : null}
      </div>

      <nav className="management-nav">
        <p className="nav-section-label">Panel principal</p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) => (isActive ? 'management-nav-link active' : 'management-nav-link')}
          >
            {item.label}
          </NavLink>
        ))}

        <p className="nav-section-label">Herramientas</p>
        {externalItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) => (isActive ? 'management-nav-link active' : 'management-nav-link')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button type="button" className="secondary-button logout-button" onClick={logout}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default function ManagementLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="management-layout">
      <aside className="management-sidebar desktop-only">
        <SidebarContent />
      </aside>

      {mobileOpen ? (
        <div className="management-mobile-overlay">
          <button type="button" className="overlay-backdrop" onClick={() => setMobileOpen(false)} aria-label="Cerrar" />
          <aside className="management-sidebar mobile-drawer">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="management-content">
        <header className="management-mobile-header mobile-only">
          <button type="button" className="icon-button" onClick={() => setMobileOpen(true)} aria-label="Abrir menú">
            ☰
          </button>
          <Logo />
          <span>CNEISI Admin</span>
        </header>
        <main className="management-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
