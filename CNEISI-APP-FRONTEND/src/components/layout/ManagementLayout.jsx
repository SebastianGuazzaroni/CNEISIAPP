import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../Logo';
import utnLogo from '../../style/img/Logo_Blanco.png';

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
    <div className="d-flex flex-column h-100 p-3 gap-3">
      <div className="d-flex align-items-center gap-2 pb-3 border-bottom border-secondary-subtle">
        <Logo />
        <div className="flex-grow-1">
          <div className="fw-semibold">CNEISI Admin</div>
          <img src={utnLogo} alt="UTN FRSF" className="brand-logo-utn mt-1" style={{ height: '1.5rem' }} />
        </div>
        {onClose ? (
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose} aria-label="Cerrar menú">
            ✕
          </button>
        ) : null}
      </div>

      <nav className="d-flex flex-column gap-1 flex-grow-1">
        <p className="small text-uppercase text-secondary mb-1" style={{ letterSpacing: '0.08em' }}>
          Panel principal
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) => `nav-pill-link ${isActive ? 'active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}

        <p className="small text-uppercase text-secondary mb-1 mt-3" style={{ letterSpacing: '0.08em' }}>
          Herramientas
        </p>
        {externalItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) => `nav-pill-link ${isActive ? 'active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button type="button" className="btn btn-success w-100" onClick={logout}>
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

      <div className="min-w-0">
        <header className="management-mobile-header mobile-only align-items-center gap-3 px-3 py-2 border-bottom border-secondary-subtle">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setMobileOpen(true)} aria-label="Abrir menú">
            ☰
          </button>
          <Logo />
          <span className="fw-semibold">CNEISI Admin</span>
        </header>
        <main className="p-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
