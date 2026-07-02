import { useEffect, useMemo, useState } from 'react';
import api from '../../api/client';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import PageShell from '../../components/ui/PageShell';
import Toast from '../../components/ui/Toast';

const ESTADOS = ['confirmada', 'pendiente', 'cancelada'];

async function fetchInscriptions() {
  const { data } = await api.get('/Inscripciones');
  return data;
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('es-AR');
}

export default function AdminInscriptionsPage() {
  const [inscriptions, setInscriptions] = useState([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState('');
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    fetchInscriptions()
      .then(setInscriptions)
      .catch((error) => setToast(error.message));
  }, []);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return inscriptions;
    return inscriptions.filter((item) => {
      const usuario = item.usuario || {};
      const evento = item.evento || {};
      return (
        String(item.id).includes(needle) ||
        usuario.nombreApellido?.toLowerCase().includes(needle) ||
        usuario.email?.toLowerCase().includes(needle) ||
        evento.titulo?.toLowerCase().includes(needle)
      );
    });
  }, [inscriptions, search]);

  async function refresh() {
    const next = await fetchInscriptions();
    setInscriptions(next);
  }

  function openEdit(item) {
    setEditing({ id: item.id, estado: item.estado });
  }

  async function handleSave(event) {
    event.preventDefault();
    if (!editing) return;
    try {
      await api.put(`/Inscripciones/${editing.id}`, { estado: editing.estado });
      setToast('Inscripción actualizada');
      setEditing(null);
      await refresh();
    } catch (error) {
      setToast(error.message);
    }
  }

  function askDelete(item) {
    setConfirm({
      title: `¿Eliminar inscripción #${item.id}?`,
      action: async () => {
        setConfirm(null);
        try {
          await api.delete(`/Inscripciones/${item.id}`);
          setToast('Inscripción eliminada');
          await refresh();
        } catch (error) {
          setToast(error.message);
        }
      },
    });
  }

  return (
    <>
      <PageShell title="Inscripciones" description="Listar, editar y eliminar inscripciones">
        <div className="table-toolbar">
          <input
            className="search-input"
            placeholder="Buscar por ID, participante o evento..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {editing ? (
          <form className="form-card glass-card" onSubmit={handleSave}>
            <h3>Editar inscripción #{editing.id}</h3>
            <label>
              Estado
              <select
                value={editing.estado}
                onChange={(event) => setEditing({ ...editing, estado: event.target.value })}
              >
                {ESTADOS.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
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
                <th>Participante</th>
                <th>Evento</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Fecha inscripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      <div>{item.usuario?.nombreApellido || '-'}</div>
                      <small>{item.usuario?.email || '-'}</small>
                    </td>
                    <td>{item.evento?.titulo || '-'}</td>
                    <td>{item.evento?.tipo || '-'}</td>
                    <td>{item.estado}</td>
                    <td>{formatDate(item.fechaInscripcion)}</td>
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
                    <EmptyState message="Sin inscripciones" description="No hay registros para mostrar" />
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
