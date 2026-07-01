import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function WelcomePage() {
  return (
    <main className="auth-screen">
      <Logo large />
      <div className="auth-card glass-card welcome-card">
        <h1>Bienvenido a CNEISI</h1>
        <p>Gestioná tu participación en el congreso</p>
        <div className="welcome-actions">
          <Link to="/login" className="primary-button wide-save">
            Ingresar
          </Link>
          <Link to="/register" className="secondary-button wide-save">
            Registrarse
          </Link>
        </div>
      </div>
    </main>
  );
}
