import { Navigate, Route, Routes } from 'react-router-dom';
import { getHomeRoute } from '../utils/routes';
import { AuthProvider } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';
import ParticipantLayout from '../components/layout/ParticipantLayout';
import ManagementLayout from '../components/layout/ManagementLayout';
import WelcomePage from '../pages/welcome';
import LoginPage from '../pages/login';
import RegisterPage from '../pages/register';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import AdminAreaLayout from '../components/layout/AdminAreaLayout';
import AdminInscriptionsPage from '../pages/admin/AdminInscriptionsPage';
import AdminAttendancesPage from '../pages/admin/AdminAttendancesPage';
import ScannerPage from '../pages/ScannerPage';
import HomePage from '../pages/participant/HomePage';
import TimelinePage from '../pages/participant/TimelinePage';
import InscriptionsPage from '../pages/participant/InscriptionsPage';
import DashboardPage from '../pages/management/DashboardPage';
import WhitelistPage from '../pages/management/WhitelistPage';
import AdminsPage from '../pages/management/AdminsPage';
import ActivitiesPage from '../pages/management/ActivitiesPage';
import ActivityFormPage from '../pages/management/ActivityFormPage';
import MetricsPage from '../pages/management/MetricsPage';

function RootRedirect() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/welcome" replace />;
  return <Navigate to={getHomeRoute(user?.rol)} replace />;
}

function GuestOnly({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={getHomeRoute(user?.rol)} replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/welcome" element={<GuestOnly><WelcomePage /></GuestOnly>} />
        <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
        <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route element={<ProtectedRoute roles={['participant']} />}>
          <Route element={<ParticipantLayout />}>
            <Route path="/participant" element={<HomePage />} />
            <Route path="/participant/timeline" element={<TimelinePage />} />
            <Route path="/participant/inscriptions" element={<InscriptionsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['admin', 'superadmin']} />}>
          <Route element={<AdminAreaLayout />}>
            <Route path="/scanner" element={<ScannerPage />} />
            <Route path="/scanner/inscripciones" element={<AdminInscriptionsPage />} />
            <Route path="/scanner/asistencias" element={<AdminAttendancesPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={['superadmin']} />}>
          <Route element={<ManagementLayout />}>
            <Route path="/management" element={<DashboardPage />} />
            <Route path="/management/whitelist" element={<WhitelistPage />} />
            <Route path="/management/admins" element={<AdminsPage />} />
            <Route path="/management/activities" element={<ActivitiesPage />} />
            <Route path="/management/activities/new" element={<ActivityFormPage />} />
            <Route path="/management/activities/:id/edit" element={<ActivityFormPage />} />
            <Route path="/management/metrics" element={<MetricsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
