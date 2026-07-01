import { useEffect, useState } from 'react';
import api from '../../api/client';
import PageShell from '../../components/ui/PageShell';
import Toast from '../../components/ui/Toast';
import { normalizeRole } from '../../utils/roleUtils';

export default function MetricsPage() {
  const [metrics, setMetrics] = useState({ participants: 0, events: 0, inscriptions: 0, admins: 0 });
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function loadMetrics() {
      try {
        const [usersRes, eventsRes, inscriptionsRes] = await Promise.all([
          api.get('/Usuarios'),
          api.get('/Eventos'),
          api.get('/Inscripciones'),
        ]);

        const users = usersRes.data;
        setMetrics({
          participants: users.filter((user) => normalizeRole(user.rol) === 'participant').length,
          admins: users.filter((user) => normalizeRole(user.rol) === 'admin').length,
          events: eventsRes.data.length,
          inscriptions: inscriptionsRes.data.length,
        });
      } catch (error) {
        setToast(error.message);
      }
    }

    loadMetrics();
  }, []);

  return (
    <>
      <PageShell title="Métricas" description="Estadísticas en tiempo real del congreso">
        <div className="metrics-grid">
          <div className="metric-card glass-card">
            <span>Participantes</span>
            <strong>{metrics.participants}</strong>
          </div>
          <div className="metric-card glass-card">
            <span>Administradores</span>
            <strong>{metrics.admins}</strong>
          </div>
          <div className="metric-card glass-card">
            <span>Actividades</span>
            <strong>{metrics.events}</strong>
          </div>
          <div className="metric-card glass-card">
            <span>Inscripciones</span>
            <strong>{metrics.inscriptions}</strong>
          </div>
        </div>
      </PageShell>
      <Toast message={toast} />
    </>
  );
}
