import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import TalksAdmin from '../../components/TalksAdmin';
import PageShell from '../../components/ui/PageShell';
import Toast from '../../components/ui/Toast';
import { normalizeEvent } from '../../utils/eventUtils';

export default function ActivitiesPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function loadEvents() {
      try {
        const { data } = await api.get('/Eventos');
        setEvents(data.map(normalizeEvent));
      } catch (error) {
        setToast(error.message);
      }
    }

    loadEvents();
  }, []);

  return (
    <>
      <PageShell
        title="Actividades"
        description="Charlas y talleres del congreso"
        actions={
          <Link to="/management/activities/new" className="primary-button">
            Nueva actividad
          </Link>
        }
      >
        <TalksAdmin
          events={events}
          onAdd={() => navigate('/management/activities/new')}
          onEdit={(event) => navigate(`/management/activities/${event.id}/edit`)}
        />
      </PageShell>
      <Toast message={toast} />
    </>
  );
}
