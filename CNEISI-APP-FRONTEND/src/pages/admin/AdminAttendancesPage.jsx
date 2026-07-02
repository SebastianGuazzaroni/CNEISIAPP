import { useEffect, useState } from 'react';
import api from '../../api/client';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import PageShell from '../../components/ui/PageShell';
import Toast from '../../components/ui/Toast';

async function fetchEvents() {
  const { data } = await api.get('/Eventos');
  return data;
}

async function fetchAttendances(eventoId) {
  const params = eventoId ? { eventoId } : {};
  const { data } = await api.get('/Asistencias', { params });
  return data;
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('es-AR');
}

export default function AdminAttendancesPage() {
  const [events, setEvents] = useState([]);
  const [eventoId, setEventoId] = useState('');
  const [attendances, setAttendances] = useState([]);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState('');
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch((error) => setToast(error.message));
  }, []);

  useEffect(() => {
    if (!eventoId) {
      setAttendances([]);
      return;
    }

    fetchAttendances(eventoId)
      .then(setAttendances)
      .catch((error) => setToast(error.message));
  }, [eventoId]);

  async function refresh() {
    if (!eventoId) return;
    const next = await fetchAttendances(eventoId);
    setAttendances(next);
  }

  function openEdit(item) {
    const date = new Date(item.fechaRegistro);
    const fechaRegistro = Number.isNaN(date.getTime())
      ? ''
      : date.toISOString().slice(0, 16);
    setEditing({
      id: item.id,
      fechaRegistro,
      metodo: item.metodo,
      inscrito: item.inscrito,
    });
  }

  async function handleSave(event) {
    event.preventDefault();
    if (!editing) return;
    try {
      await api.put(`/Asistencias/${editing.id}`, {
        fechaRegistro: new Date(editing.fechaRegistro).toISOString(),
        metodo: editing.metodo,
        inscrito: editing.inscrito,
      });
      setToast('Asistencia actualizada');
      setEditing(null);
      await refresh();
    } catch (error) {
      setToast(error.message);
    }
  }

  function askDelete(item) {
    setConfirm({
      title: `¿Eliminar asistencia #${item.id}?`,
      action: async () => {
        setConfirm(null);
        try {
          await api.delete(`/Asistencias/${item.id}`);
          setToast('Asistencia eliminada');
          await refresh();
        } catch (error) {
          setToast(error.message);
        }
      },
    });
  }

  return (
    <>
      <PageShell title="Asistencias" description="Ver y gestionar asistencias por evento">
        <div className="table-toolbar">
          <label>
            Evento
            <select value={eventoId} onChange={(event) => setEventoId(event.target.value)}>
              <option value="">Seleccionar evento</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.titulo}
                </option>
              ))}
            </select>
          </label>
        </div>

        {editing ? (
          <form className="form-card glass-card" onSubmit={handleSave}>
            <h3>Editar asistencia #{editing.id}</h3>
            <label>
              Fecha y hora
              <input
                type="datetime-local"
                value={editing.fechaRegistro}
                onChange={(event) => setEditing({ ...editing, fechaRegistro: event.target.value })}
                required
              />
            </label>
            <label>
              Método
              <input
                value={editing.metodo}
                onChange={(event) => setEditing({ ...editing, metodo: event.target.value })}
                required
              />
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={editing.inscrito}
                onChange={(event) => setEditing({ ...editing, inscrito: event.target.checked })}
              />
              Inscripto
            </label>
            <div className="form-actions">
              <button type="submit" className="primary-button">
                Guardar
              </button>
              <button type="button" onClick={() => setEditing(null)}>
                Cancelar
              </button>
            </div>
          </form>
        ) : null}

        <div className="data-table glass-card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Evento</th>
                <th>Tipo</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Fecha y hora</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {!eventoId ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState message="Seleccioná un evento" description="Elegí un evento para ver sus asistencias" />
                  </td>
                </tr>
              ) : attendances.length ? (
                attendances.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.evento?.titulo || '-'}</td>
                    <td>{item.evento?.tipo || '-'}</td>
                    <td>{item.usuario?.nombreApellido || '-'}</td>
                    <td>{item.usuario?.email || '-'}</td>
                    <td>{formatDate(item.fechaRegistro)}</td>
                    <td className="table-actions-cell">
                      <button type="button" onClick={() => openEdit(item)}>
                        Editar
                      </button>
                      <button type="button" className="danger-button" onClick={() => askDelete(item)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <EmptyState message="Sin asistencias" description="No hay registros para este evento" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </PageShell>

      <ConfirmDialog
        title={confirm?.title}
        onConfirm={confirm?.action}
        onCancel={() => setConfirm(null)}
      />
      <Toast message={toast} />
    </>
  );
}
