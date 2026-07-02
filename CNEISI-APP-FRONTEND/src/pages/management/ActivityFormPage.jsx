import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../api/client';
import TalkForm from '../../components/TalkForm';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import PageShell from '../../components/ui/PageShell';
import Toast from '../../components/ui/Toast';
import {
  buildEventPayload,
  emptyTalkForm,
  toDateInput,
} from '../../utils/eventUtils';

export default function ActivityFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [form, setForm] = useState(emptyTalkForm);
  const [toast, setToast] = useState('');
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    if (!isEditing) return;

    async function loadEvent() {
      try {
        const { data } = await api.get(`/Eventos/${id}`);
        const date = new Date(data.fecha);
        const endDate = data.fechaFin ? new Date(data.fechaFin) : null;
        setForm({
          titulo: data.titulo,
          descripcion: data.descripcion || '',
          orador: data.orador,
          fecha: toDateInput(data.fecha),
          horaInicio: date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false }),
          horaFin: endDate
            ? endDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })
            : '',
          sala: data.sala,
          cupoMaximo: data.cupoMaximo,
          tipo: data.tipo || 'CHARLA',
        });
      } catch (error) {
        setToast(error.message);
      }
    }

    loadEvent();
  }, [id, isEditing]);

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = buildEventPayload(form);

    try {
      if (isEditing) {
        await api.put(`/Eventos/${id}`, payload);
        setToast('Actividad actualizada');
      } else {
        await api.post('/Eventos', payload);
        setToast('Actividad creada');
      }
      navigate('/management/activities');
    } catch (error) {
      setToast(error.message);
    }
  }

  function askDelete() {
    setConfirm({
      title: '¿Eliminar esta actividad?',
      action: async () => {
        setConfirm(null);
        try {
          await api.delete(`/Eventos/${id}`);
          setToast('Actividad eliminada');
          navigate('/management/activities');
        } catch (error) {
          setToast(error.message);
        }
      },
    });
  }

  return (
    <>
      <PageShell
        title={isEditing ? 'Editar actividad' : 'Nueva actividad'}
        description="Configurá charlas y talleres del evento"
        actions={
          <Link to="/management/activities" className="btn btn-secondary">
            Volver
          </Link>
        }
      >
        <TalkForm
          editing={isEditing}
          form={form}
          onChange={setForm}
          onDelete={askDelete}
          onSubmit={handleSubmit}
        />
      </PageShell>
      <ConfirmDialog
        destructive
        title={confirm?.title}
        onConfirm={confirm?.action}
        onCancel={() => setConfirm(null)}
      />
      <Toast message={toast} />
    </>
  );
}
