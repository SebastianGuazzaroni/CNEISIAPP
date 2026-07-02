import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { normalizeRole } from '../utils/roleUtils';

export default function ProtectedRoute({ roles }) {
  const { isAuthenticated, user } = useAuth();

  // Si no hay usuario autenticado, redirige al login.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta requiere roles específicos, verifica el rol del usuario.
  if (roles?.length) {
    const userRole = normalizeRole(user?.rol);
    if (!roles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Si pasa todas las validaciones, renderiza la ruta anidada.
  return <Outlet />;
}
