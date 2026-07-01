import { Link } from 'react-router-dom';
import PageShell from '../../components/ui/PageShell';

export default function DashboardPage() {
  return (
    <PageShell title="Panel de gestión" description="Administrá el contenido del congreso CNEISI">
      <div className="dashboard-grid">
        <Link to="/management/whitelist" className="dashboard-card glass-card">
          <h3>Lista Blanca</h3>
          <p>Gestionar alumnos habilitados</p>
        </Link>
        <Link to="/management/admins" className="dashboard-card glass-card">
          <h3>Administradores</h3>
          <p>ABM de cuentas admin</p>
        </Link>
        <Link to="/management/activities" className="dashboard-card glass-card">
          <h3>Actividades</h3>
          <p>Charlas y talleres del evento</p>
        </Link>
        <Link to="/management/metrics" className="dashboard-card glass-card">
          <h3>Métricas</h3>
          <p>Estadísticas del congreso</p>
        </Link>
        <Link to="/scanner" className="dashboard-card glass-card">
          <h3>Escáner QR</h3>
          <p>Control de asistencia</p>
        </Link>
      </div>
    </PageShell>
  );
}
