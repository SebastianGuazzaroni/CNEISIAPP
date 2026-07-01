import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import PageShell from '../../components/ui/PageShell';

export default function HomePage() {
  const { user } = useAuth();
  const qrData = user?.id ? `CNEISI-USER-${user.id}` : '...';

  return (
    <PageShell title="Mi perfil" description="Accedé a tu información y código QR del congreso">
      <div className="profile-card glass-card">
        <h2>{user?.nombreApellido}</h2>
        <p>{user?.email}</p>
        <div className="qr-placeholder">
          <div className="qr-box">{qrData}</div>
          <p className="qr-hint">Presentá este código en el acceso a las charlas</p>
        </div>
      </div>
      <div className="quick-links">
        <Link to="/participant/timeline" className="quick-link glass-card">
          Ver cronograma
        </Link>
        <Link to="/participant/inscriptions" className="quick-link glass-card">
          Mis inscripciones
        </Link>
      </div>
    </PageShell>
  );
}
