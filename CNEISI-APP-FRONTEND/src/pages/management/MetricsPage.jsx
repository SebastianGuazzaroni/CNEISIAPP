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

  const items = [
    { label: 'Participantes', value: metrics.participants },
    { label: 'Administradores', value: metrics.admins },
    { label: 'Actividades', value: metrics.events },
    { label: 'Inscripciones', value: metrics.inscriptions },
  ];

  return (
    <>
      <PageShell title="Métricas" description="Estadísticas en tiempo real del congreso">
        <div className="row g-3">
          {items.map((item) => (
            <div key={item.label} className="col-md-6 col-xl-3">
              <div className="glass-card p-4 h-100">
                <span className="text-secondary">{item.label}</span>
                <strong className="d-block display-6 text-warning mt-2">{item.value}</strong>
              </div>
            </div>
          ))}
        </div>
      </PageShell>
      <Toast message={toast} />
    </>
  );
}
