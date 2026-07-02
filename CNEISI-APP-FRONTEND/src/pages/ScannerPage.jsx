import { useEffect, useState } from 'react';
import api from '../api/client';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import PageShell from '../components/ui/PageShell';
import Toast from '../components/ui/Toast';

export default function ScannerPage() {
  const [events, setEvents] = useState([]);
  const [eventoId, setEventoId] = useState('');
  const [email, setEmail] = useState('');
  const [validation, setValidation] = useState(null);
  const [toast, setToast] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/Eventos')
      .then(({ data }) => setEvents(data))
      .catch((error) => setToast(error.message));
  }, []);

  async function handleValidate(event) {
    event.preventDefault();
    setValidation(null);
    setLoading(true);

    try {
      const { data } = await api.post('/Asistencias/validar', {
        email: email.trim(),
        eventoId: Number(eventoId),
      });
      setValidation({ status: data.inscrito ? 'ok' : 'warn', ...data });
    } catch (error) {
      setValidation({ status: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function registerAttendance(confirmar = false) {
    setLoading(true);
    try {
      const { data } = await api.post('/Asistencias/manual', {
        email: email.trim(),
        eventoId: Number(eventoId),
        confirmar,
      });
      setValidation({
        status: data.inscrito ? 'ok' : 'warn',
        message: data.message,
        usuario: data.usuario,
        evento: data.evento,
        inscrito: data.inscrito,
        registered: true,
      });
      setToast(data.message);
      setConfirm(null);
      setEmail('');
    } catch (error) {
      if (error.data?.requiresConfirmation) {
        setConfirm({
          title: `${error.data.usuario?.nombreApellido || 'Este participante'} no está inscripto. ¿Registrar asistencia igual?`,
          action: () => registerAttendance(true),
        });
      } else {
        setValidation({ status: 'error', message: error.message });
        setToast(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    setConfirm(null);

    if (validation?.status === 'warn' && !validation?.registered) {
      setConfirm({
        title: `${validation.usuario.nombreApellido} no está inscripto. ¿Registrar asistencia igual?`,
        action: () => registerAttendance(true),
      });
      return;
    }

    await registerAttendance(false);
  }

  return (
    <>
      <PageShell title="Escáner QR" description="Control de asistencia a actividades">
        <div className="glass-card p-4 p-md-5 text-center">
          <div className="scanner-frame">
            <div className="scanner-corner tl" />
            <div className="scanner-corner tr" />
            <div className="scanner-corner bl" />
            <div className="scanner-corner br" />
          </div>
          <p className="fw-semibold mb-1">Escáner con cámara — Próximamente</p>
          <p className="text-secondary small mb-0">Usá el registro manual mientras tanto</p>
        </div>

        <form className="glass-card p-4 d-flex flex-column gap-3" onSubmit={handleValidate}>
          <h3 className="h5 fw-bold mb-0">Registro manual</h3>
          <label className="d-flex flex-column gap-1 small text-secondary">
            Actividad
            <select className="form-select" value={eventoId} onChange={(e) => setEventoId(e.target.value)} required>
              <option value="">Seleccionar actividad</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.titulo}
                </option>
              ))}
            </select>
          </label>
          <label className="d-flex flex-column gap-1 small text-secondary">
            Email del participante
            <input
              className="form-control"
              type="email"
              placeholder="participante@cneisi.test"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setValidation(null);
              }}
              required
            />
          </label>
          <div className="d-flex gap-2 flex-wrap">
            <button type="submit" className="btn btn-secondary" disabled={loading}>
              Validar
            </button>
            <button
              type="button"
              className="btn btn-success"
              disabled={loading || !eventoId || !email.trim()}
              onClick={handleRegister}
            >
              Registrar asistencia
            </button>
          </div>
        </form>

        {validation ? (
          <div className={`glass-card p-4 status-${validation.status}`}>
            {validation.status === 'ok' ? (
              <>
                <span className="status-pill status-ok">Confirmado</span>
                <p className="mb-0 mt-2">
                  {validation.usuario?.nombreApellido} — inscripto en {validation.evento?.titulo}
                </p>
              </>
            ) : null}
            {validation.status === 'warn' ? (
              <>
                <span className="status-pill status-warn">Sin inscripción</span>
                <p className="mb-0 mt-2">
                  {validation.usuario?.nombreApellido} no está inscripto en esta actividad.
                  {validation.registered ? ' Asistencia registrada igualmente.' : ' Podés confirmar el registro.'}
                </p>
              </>
            ) : null}
            {validation.status === 'error' ? (
              <>
                <span className="status-pill status-error">Inválido</span>
                <p className="mb-0 mt-2">{validation.message}</p>
              </>
            ) : null}
          </div>
        ) : null}

        <div className="d-flex gap-2 flex-wrap">
          <span className="status-pill status-ok">Confirmado</span>
          <span className="status-pill status-warn">Sin inscripción</span>
          <span className="status-pill status-error">Inválido</span>
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
