import { Link } from 'react-router-dom';
import PageShell from '../../components/ui/PageShell';

const cards = [
  { to: '/management/whitelist', title: 'Lista Blanca', desc: 'Gestionar alumnos habilitados' },
  { to: '/management/admins', title: 'Administradores', desc: 'ABM de cuentas admin' },
  { to: '/management/activities', title: 'Actividades', desc: 'Charlas y talleres del evento' },
  { to: '/management/metrics', title: 'Métricas', desc: 'Estadísticas del congreso' },
  { to: '/scanner', title: 'Escáner QR', desc: 'Control de asistencia' },
];

export default function DashboardPage() {
  return (
    <PageShell title="Panel de gestión" description="Administrá el contenido del congreso CNEISI">
      <div className="row g-3">
        {cards.map((card) => (
          <div key={card.to} className="col-md-6 col-xl-4">
            <Link to={card.to} className="glass-card p-4 d-block h-100 text-decoration-none">
              <h3 className="h5 fw-bold text-warning mb-2">{card.title}</h3>
              <p className="text-secondary mb-0">{card.desc}</p>
            </Link>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
