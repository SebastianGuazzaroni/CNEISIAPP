import { useEffect, useMemo, useState } from 'react';
import api from '../../api/client';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import PageShell from '../../components/ui/PageShell';
import Toast from '../../components/ui/Toast';
import { normalizeRole } from '../../utils/roleUtils';

const emptyForm = { nombreApellido: '', email: '', password: '' };

async function fetchAdmins() {
  const { data } = await api.get('/Usuarios');
  return data.filter((user) => normalizeRole(user.rol) === 'admin');
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState('');
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    fetchAdmins()
      .then(setAdmins)
      .catch((error) => setToast(error.message));
  }, []);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return admins;
    return admins.filter(
      (admin) =>
        admin.email.toLowerCase().includes(needle) ||
        admin.nombreApellido.toLowerCase().includes(needle),
    );
  }, [admins, search]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(admin) {
    setEditingId(admin.id);
    setForm({ nombreApellido: admin.nombreApellido, email: admin.email, password: '' });
    setShowForm(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      if (editingId) {
        const payload = {
          nombreApellido: form.nombreApellido,
          email: form.email,
        };
        if (form.password) payload.password = form.password;
        await api.put(`/Usuarios/${editingId}`, payload);
        setToast('Administrador actualizado');
      } else {
        await api.post('/Usuarios/admin', form);
        setToast('Administrador creado');
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      const nextAdmins = await fetchAdmins();
      setAdmins(nextAdmins);
    } catch (error) {
      setToast(error.message);
    }
  }

  function askDelete(admin) {
    setConfirm({
      title: `¿Eliminar al administrador ${admin.nombreApellido}?`,
      action: async () => {
        setConfirm(null);
        try {
          await api.delete(`/Usuarios/${admin.id}`);
          setToast('Administrador eliminado');
          const nextAdmins = await fetchAdmins();
          setAdmins(nextAdmins);
        } catch (error) {
          setToast(error.message);
        }
      },
    });
  }

  return (
    <>
      <PageShell
        title="Administradores"
        description="Gestionar cuentas de coordinadores y voluntarios"
        actions={
          <button type="button" className="primary-button" onClick={openCreate}>
            Nuevo administrador
          </button>
        }
      >
        <div className="table-toolbar">
          <input
            className="search-input"
            placeholder="Buscar..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {showForm ? (
          <form className="form-card glass-card" onSubmit={handleSubmit}>
            <h3>{editingId ? 'Editar administrador' : 'Nuevo administrador'}</h3>
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
            <input
              placeholder={editingId ? 'Nueva contraseña (opcional)' : 'Contraseña'}
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required={!editingId}
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
                filtered.map((admin) => (
                  <tr key={admin.id}>
                    <td>{admin.nombreApellido}</td>
                    <td>{admin.email}</td>
                    <td className="table-actions-cell">
                      <button type="button" onClick={() => openEdit(admin)}>
                        Editar
                      </button>
                      <button type="button" className="danger-button" onClick={() => askDelete(admin)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>
                    <EmptyState message="Sin administradores" description="Creá una cuenta admin" />
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
