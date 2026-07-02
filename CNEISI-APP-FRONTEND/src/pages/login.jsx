import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { getHomeRoute } from '../utils/routes';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      const user = await login(form.email, form.password);
      navigate(getHomeRoute(user.rol));
    } catch (err) {
      const message = err.message || 'Credenciales inválidas';
      if (message.includes('no autorizado')) {
        navigate('/unauthorized');
        return;
      }
      setError(message);
    }
  }

  return (
    <main className="auth-screen">
      <Logo large showUtn centered />
      <form className="glass-card p-4 w-100 d-flex flex-column gap-3" style={{ maxWidth: '420px' }} onSubmit={handleSubmit}>
        <h1 className="h4 fw-bold mb-0">Iniciar sesión</h1>
        <input
          aria-label="Email"
          className={`form-control ${error ? 'is-invalid' : ''}`}
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
        <input
          aria-label="Contraseña"
          className="form-control"
          placeholder="Contraseña"
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          required
        />
        {error ? <span className="text-danger small">{error}</span> : null}
        <button className="btn btn-cneisi" type="submit">
          Iniciar sesión
        </button>
        <Link to="/welcome" className="text-link text-center">
          Volver
        </Link>
      </form>
    </main>
  );
}
