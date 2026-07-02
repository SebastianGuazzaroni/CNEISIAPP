import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function WelcomePage() {
  return (
    <main className="welcome-screen">
      <Logo large showUtn centered />
      <div className="accent-bar" />
      <div className="glass-card p-4 p-md-5 w-100" style={{ maxWidth: '460px' }}>
        <h1 className="h2 fw-bold text-center mb-2">Bienvenido a CNEISI</h1>
        <p className="text-secondary text-center mb-4">
          Gestioná tu participación en el congreso de Sistemas
        </p>
        <div className="d-grid gap-3">
          <Link to="/login" className="btn btn-cneisi btn-lg">
            Ingresar
          </Link>
          <Link to="/register" className="btn btn-outline-cneisi btn-lg">
            Registrarse
          </Link>
        </div>
      </div>
    </main>
  );
}
