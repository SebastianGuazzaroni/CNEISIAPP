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
          <button type="button" className="btn btn-cneisi" onClick={openCreate}>
            Nuevo administrador
          </button>
        }
      >
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Buscar..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {showForm ? (
          <form className="glass-card p-4 d-flex flex-column gap-3 mb-3" onSubmit={handleSubmit}>
            <h3 className="h5 fw-bold">{editingId ? 'Editar administrador' : 'Nuevo administrador'}</h3>
            <input
              className="form-control"
              placeholder="Nombre completo"
              value={form.nombreApellido}
              onChange={(event) => setForm({ ...form, nombreApellido: event.target.value })}
              required
            />
            <input
              className="form-control"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
            <input
              className="form-control"
              placeholder={editingId ? 'Nueva contraseña (opcional)' : 'Contraseña'}
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required={!editingId}
            />
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success">
                Guardar
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
            </div>
          </form>
        ) : null}

        <div className="glass-card p-0 overflow-auto">
          <table className="table table-hover mb-0">
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
                    <td className="d-flex gap-2">
                      <button type="button" className="btn btn-sm btn-outline-cneisi" onClick={() => openEdit(admin)}>
                        Editar
                      </button>
                      <button type="button" className="btn btn-sm btn-danger" onClick={() => askDelete(admin)}>
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
        destructive
        title={confirm?.title}
        onConfirm={confirm?.action}
        onCancel={() => setConfirm(null)}
      />
      <Toast message={toast} />
    </>
  );
}
