import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function UnauthorizedPage() {
  return (
    <main className="auth-screen">
      <Logo large />
      <div className="auth-card glass-card">
        <h1>Acceso no autorizado</h1>
        <p>Tu email no está en la lista blanca del congreso. Contactá al organizador del evento.</p>
        <Link to="/login" className="primary-button">
          Volver al login
        </Link>
      </div>
    </main>
  );
}
