import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ nombreApellido: '', email: '', password: '' });
  const [error, setError] = useState('');

  function handleChange(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const nombreApellido = form.nombreApellido.trim();
    const email = form.email.trim();
    const { password } = form;

    if (!nombreApellido || !email || !password) {
      setError('Completa todos los campos para registrarte');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Ingresa un email válido');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      const message = err.message || 'No se pudo registrar usuario';
      if (message.includes('lista blanca') || message.includes('no autorizado')) {
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
        <h1>Registrarse</h1>
        <input
          placeholder="Nombre completo"
          value={form.nombreApellido}
          onChange={(event) => handleChange('nombreApellido', event.target.value)}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(event) => handleChange('email', event.target.value)}
          required
        />
        <input
          placeholder="Contraseña"
          type="password"
          value={form.password}
          onChange={(event) => handleChange('password', event.target.value)}
          required
        />
        {error ? <span className="form-error">{error}</span> : null}
        <button className="primary-button" type="submit">
          Crear cuenta
        </button>
        <Link to="/welcome" className="text-link">
          Volver
        </Link>
      </form>
    </main>
  );
}
