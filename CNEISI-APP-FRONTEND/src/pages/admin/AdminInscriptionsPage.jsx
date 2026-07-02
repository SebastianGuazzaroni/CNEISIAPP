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
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Buscar por ID, participante o evento..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {editing ? (
          <form className="glass-card p-4 d-flex flex-column gap-3 mb-3" onSubmit={handleSave}>
            <h3 className="h5 fw-bold">Editar inscripción #{editing.id}</h3>
            <label className="d-flex flex-column gap-1 small text-secondary">
              Estado
              <select
                className="form-select"
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
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success">
                Guardar
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditing(null)}>
                Cancelar
              </button>
            </div>
          </form>
        ) : null}

        <div className="glass-card p-0 overflow-auto">
          <table className="table table-hover mb-0">
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
                    <td className="d-flex gap-2">
                      <button type="button" className="btn btn-sm btn-outline-cneisi" onClick={() => openEdit(item)}>
                        Editar
                      </button>
                      <button type="button" className="btn btn-sm btn-danger" onClick={() => askDelete(item)}>
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
        destructive
        title={confirm?.title}
        onConfirm={confirm?.action}
        onCancel={() => setConfirm(null)}
      />
      <Toast message={toast} />
    </>
  );
}
