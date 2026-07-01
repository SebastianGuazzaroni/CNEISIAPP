import { useEffect, useState } from 'react';
import api from '../../api/client';
import EventCards from '../../components/EventCards';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Toast from '../../components/ui/Toast';
import { normalizeEvent } from '../../utils/eventUtils';

async function fetchInscriptionItems() {
  const { data } = await api.get('/Inscripciones');
  return data
    .filter((item) => item.evento)
    .map((item) => ({
      inscriptionId: item.id,
      event: normalizeEvent(item.evento),
    }));
}

export default function InscriptionsPage() {
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState('');
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    fetchInscriptionItems()
      .then(setItems)
      .catch((error) => setToast(error.message));
  }, []);

  function askCancel(item) {
    setConfirm({
      title: `¿Desea cancelar la inscripción a ${item.event.titulo}?`,
      action: () => cancelInscription(item.inscriptionId),
    });
  }

  async function cancelInscription(id) {
    setConfirm(null);
    try {
      await api.delete(`/Inscripciones/${id}`);
      setToast('Inscripción cancelada');
      const nextItems = await fetchInscriptionItems();
      setItems(nextItems);
    } catch (error) {
      setToast(error.message);
    }
  }

  const events = items.map((item) => item.event);

  return (
    <>
      <EventCards
        title="MIS INSCRIPCIONES"
        events={events}
        mode="cancel"
        onAction={(event) => {
          const item = items.find((entry) => String(entry.event.id) === String(event.id));
          if (item) askCancel(item);
        }}
      />
      <ConfirmDialog
        title={confirm?.title}
        onConfirm={confirm?.action}
        onCancel={() => setConfirm(null)}
      />
      <Toast message={toast} />
    </>
  );
}
