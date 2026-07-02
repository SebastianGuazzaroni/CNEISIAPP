import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import EventCards from '../../components/EventCards';
import Toast from '../../components/ui/Toast';
import { normalizeEvent } from '../../utils/eventUtils';

async function fetchTimelineData() {
  const [eventsRes, inscriptionsRes] = await Promise.all([
    api.get('/Eventos'),
    api.get('/Inscripciones'),
  ]);

  return {
    events: eventsRes.data.map(normalizeEvent),
    inscriptions: inscriptionsRes.data,
  };
}

export default function TimelinePage() {
  const [events, setEvents] = useState([]);
  const [inscriptions, setInscriptions] = useState([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchTimelineData()
      .then(({ events: nextEvents, inscriptions: nextInscriptions }) => {
        setEvents(nextEvents);
        setInscriptions(nextInscriptions);
      })
      .catch((error) => setToast(error.message));
  }, []);

  const enrolledIds = new Set(inscriptions.map((item) => String(item.eventoId)));

  async function handleEnroll(event) {
    try {
      await api.post('/Inscripciones', { eventoId: event.id });
      setToast('Inscripción confirmada. Ver detalle en Mis Inscripciones.');
      const { events: nextEvents, inscriptions: nextInscriptions } = await fetchTimelineData();
      setEvents(nextEvents);
      setInscriptions(nextInscriptions);
    } catch (error) {
      setToast(error.message);
    }
  }

  const availableEvents = events.filter((event) => !enrolledIds.has(String(event.id)));

  return (
    <>
      <EventCards title="CRONOGRAMA" events={events} mode="schedule" />
      {availableEvents.length ? (
        <EventCards
          title="INSCRIBIRSE A CHARLAS"
          events={availableEvents}
          mode="enroll"
          onAction={handleEnroll}
        />
      ) : null}
      <p className="scanner-hint">
        <Link to="/participant/inscriptions">Ir a Mis Inscripciones</Link>
      </p>
      <Toast message={toast} />
    </>
  );
}
