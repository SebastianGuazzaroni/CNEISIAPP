import { useEffect, useMemo, useState } from 'react';
import api from '../../api/client';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import PageShell from '../../components/ui/PageShell';
import Toast from '../../components/ui/Toast';

const emptyForm = { nombreApellido: '', email: '' };

async function fetchWhitelistEntries() {
  const { data } = await api.get('/Whitelist');
  return data;
}

export default function WhitelistPage() {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState('');
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    fetchWhitelistEntries()
      .then(setEntries)
      .catch((error) => setToast(error.message));
  }, []);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return entries;
    return entries.filter(
      (entry) =>
        entry.email.toLowerCase().includes(needle) ||
        entry.nombreApellido.toLowerCase().includes(needle),
    );
  }, [entries, search]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(entry) {
    setEditingId(entry.id);
    setForm({ nombreApellido: entry.nombreApellido, email: entry.email });
    setShowForm(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      if (editingId) {
        await api.put(`/Whitelist/${editingId}`, form);
        setToast('Registro actualizado');
      } else {
        await api.post('/Whitelist', form);
        setToast('Registro creado');
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      const nextEntries = await fetchWhitelistEntries();
      setEntries(nextEntries);
    } catch (error) {
      setToast(error.message);
    }
  }

  function askDelete(entry) {
    setConfirm({
      title: `¿Eliminar a ${entry.nombreApellido} de la lista blanca?`,
      action: async () => {
        setConfirm(null);
        try {
          await api.delete(`/Whitelist/${entry.id}`);
          setToast('Registro eliminado');
          const nextEntries = await fetchWhitelistEntries();
          setEntries(nextEntries);
        } catch (error) {
          setToast(error.message);
        }
      },
    });
  }

  return (
    <>
      <PageShell
        title="Lista Blanca"
        description="Gestionar alumnos habilitados para acceder al congreso"
        actions={
          <button type="button" className="primary-button" onClick={openCreate}>
            Nuevo registro
          </button>
        }
      >
        <div className="table-toolbar">
          <input
            className="search-input"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {showForm ? (
          <form className="form-card glass-card" onSubmit={handleSubmit}>
            <h3>{editingId ? 'Editar registro' : 'Nuevo registro'}</h3>
            <input
              placeholder="Nombre completo"
              value={form.nombreApellido}
              onChange={(event) => setForm({ ...form, nombreApellido: event.target.value })}
              required
            />
            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
            <div className="form-actions">
              <button type="submit" className="primary-button">
                Guardar
              </button>
              <button type="button" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
            </div>
          </form>
        ) : null}

        <div className="data-table glass-card">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.nombreApellido}</td>
                    <td>{entry.email}</td>
                    <td className="table-actions-cell">
                      <button type="button" onClick={() => openEdit(entry)}>
                        Editar
                      </button>
                      <button type="button" className="danger-button" onClick={() => askDelete(entry)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>
                    <EmptyState
                      message="Sin registros"
                      description="Creá un registro para habilitar alumnos"
                    />
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
