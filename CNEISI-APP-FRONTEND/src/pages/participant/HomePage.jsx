import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import PageShell from '../../components/ui/PageShell';

export default function HomePage() {
  const { user } = useAuth();
  const qrData = user?.id ? `CNEISI-USER-${user.id}` : '...';

  return (
    <PageShell title="Mi perfil" description="Accedé a tu información y código QR del congreso">
      <div className="glass-card p-4">
        <h2 className="h4 fw-bold text-warning">{user?.nombreApellido}</h2>
        <p className="text-secondary">{user?.email}</p>
        <div className="text-center mt-4">
          <div className="glass-card p-4 font-monospace">{qrData}</div>
          <p className="text-secondary small mt-2 mb-0">Presentá este código en el acceso a las charlas</p>
        </div>
      </div>
      <div className="row g-3">
        <div className="col-md-6">
          <Link to="/participant/timeline" className="glass-card p-4 d-block h-100 fw-semibold">
            Ver cronograma
          </Link>
        </div>
        <div className="col-md-6">
          <Link to="/participant/inscriptions" className="glass-card p-4 d-block h-100 fw-semibold">
            Mis inscripciones
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
