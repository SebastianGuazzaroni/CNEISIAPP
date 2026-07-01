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
      <Logo large />
      <form className="auth-card glass-card login-form" onSubmit={handleSubmit}>
        <h1>Iniciar sesión</h1>
        <input
          aria-label="Email"
          className={error ? 'input-error' : ''}
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
        <input
          aria-label="Contraseña"
          placeholder="Contraseña"
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          required
        />
        {error ? <span className="form-error">{error}</span> : null}
        <button className="primary-button" type="submit">
          Iniciar sesión
        </button>
        <Link to="/welcome" className="text-link">
          Volver
        </Link>
      </form>
    </main>
  );
}
