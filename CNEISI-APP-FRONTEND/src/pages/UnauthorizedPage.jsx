import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function UnauthorizedPage() {
  return (
    <main className="auth-screen">
      <Logo large showUtn centered />
      <div className="glass-card p-4 w-100" style={{ maxWidth: '420px' }}>
        <h1 className="h4 fw-bold">Acceso no autorizado</h1>
        <p className="text-secondary">
          Tu email no está en la lista blanca del congreso. Contactá al organizador del evento.
        </p>
        <Link to="/login" className="btn btn-success w-100">
          Volver al login
        </Link>
      </div>
    </main>
  );
}
