import { useEffect, useState } from 'react';
import api from '../../api/client';
import EventCards from '../../components/EventCards';
import InscriptionDetailModal from '../../components/InscriptionDetailModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Toast from '../../components/ui/Toast';
import { normalizeEvent } from '../../utils/eventUtils';

async function fetchInscriptionItems() {
  const [inscriptionsRes, feedbacksRes] = await Promise.all([
    api.get('/Inscripciones'),
    api.get('/Feedbacks/mis'),
  ]);

  return {
    items: inscriptionsRes.data
      .filter((item) => item.evento)
      .map((item) => ({
        ...item,
        inscriptionId: item.id,
        event: normalizeEvent(item.evento),
      })),
    feedbacks: feedbacksRes.data,
  };
}

export default function InscriptionsPage() {
  const [items, setItems] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toast, setToast] = useState('');
  const [confirm, setConfirm] = useState(null);

  async function refresh() {
    const { items: nextItems, feedbacks: nextFeedbacks } = await fetchInscriptionItems();
    setItems(nextItems);
    setFeedbacks(nextFeedbacks);
    return { nextItems, nextFeedbacks };
  }

  useEffect(() => {
    refresh().catch((error) => setToast(error.message));
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
      if (selectedItem?.inscriptionId === id) {
        setSelectedItem(null);
      }
      await refresh();
    } catch (error) {
      setToast(error.message);
    }
  }

  function openDetail(event) {
    const item = items.find((entry) => String(entry.event.id) === String(event.id));
    if (item) setSelectedItem(item);
  }

  function getFeedbackForItem(item) {
    if (!item) return null;
    return feedbacks.find((entry) => String(entry.eventoId) === String(item.event.id)) || null;
  }

  async function handleFeedbackSuccess() {
    setToast('Feedback enviado correctamente');
    const { nextItems, nextFeedbacks } = await refresh();
    if (selectedItem) {
      const updated = nextItems.find((entry) => entry.inscriptionId === selectedItem.inscriptionId);
      if (updated) setSelectedItem(updated);
    }
    setFeedbacks(nextFeedbacks);
  }

  const events = items.map((item) => item.event);

  return (
    <>
      <EventCards
        title="MIS INSCRIPCIONES"
        events={events}
        mode="inscription"
        onDetail={openDetail}
        onAction={(event) => {
          const item = items.find((entry) => String(entry.event.id) === String(event.id));
          if (item) askCancel(item);
        }}
      />
      <InscriptionDetailModal
        item={selectedItem}
        feedback={getFeedbackForItem(selectedItem)}
        onClose={() => setSelectedItem(null)}
        onFeedbackSuccess={handleFeedbackSuccess}
        onFeedbackError={(message) => setToast(message)}
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
