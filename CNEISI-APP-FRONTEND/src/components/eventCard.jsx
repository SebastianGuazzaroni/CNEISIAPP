export default function EventCard({ event, mode, onAction, onDetail, isEnrolled = false }) {
  const isEnroll = mode === 'enroll';
  const isCancel = mode === 'cancel';
  const isSchedule = mode === 'schedule';
  const isInscription = mode === 'inscription';
  const isTimeline = mode === 'timeline';
  const available = event.cupoDisponible > 0;

  return (
    <article className="glass-card p-3 p-md-4">
      <header className="d-flex justify-content-between align-items-start gap-2 mb-2">
        <h3 className="h5 fw-bold mb-0 text-warning">{event.titulo}</h3>
        <span className="badge rounded-pill text-bg-dark border border-warning-subtle">
          {event.tipo || 'EVENTO'}
        </span>
      </header>
      <p className="text-secondary mb-3">{event.descripcion}</p>
      <dl className="row g-2 small mb-3">
        <div className="col-6">
          <dt className="text-secondary">Orador</dt>
          <dd className="mb-0">{event.orador}</dd>
        </div>
        <div className="col-6">
          <dt className="text-secondary">Horario</dt>
          <dd className="mb-0">{event.horaInicio} - {event.horaFin}</dd>
        </div>
        <div className="col-6">
          <dt className="text-secondary">Sala</dt>
          <dd className="mb-0">{event.sala || 'Sala no definida'}</dd>
        </div>
        <div className="col-6">
          <dt className="text-secondary">Cupo</dt>
          <dd className="mb-0">{event.cupoDisponible ?? event.cupoMaximo} disponible</dd>
        </div>
      </dl>
      {isTimeline ? (
        isEnrolled ? (
          <span className="status-pill status-ok">Inscripto</span>
        ) : (
          <button
            className="btn btn-cneisi w-100"
            type="button"
            disabled={!available}
            onClick={() => onAction && onAction(event)}
          >
            {available ? 'Inscribirse' : 'Completo'}
          </button>
        )
      ) : null}
      {isEnroll ? (
        <button
          className="btn btn-cneisi w-100"
          type="button"
          disabled={!available}
          onClick={() => onAction && onAction(event)}
        >
          {available ? 'Inscribirse' : 'Completo'}
        </button>
      ) : null}
      {isCancel ? (
        <button className="btn btn-secondary w-100" type="button" onClick={() => onAction && onAction(event)}>
          Cancelar inscripción
        </button>
      ) : null}
      {isInscription ? (
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-cneisi flex-grow-1" type="button" onClick={() => onDetail && onDetail(event)}>
            Ver detalle
          </button>
          <button className="btn btn-danger flex-grow-1" type="button" onClick={() => onAction && onAction(event)}>
            Cancelar
          </button>
        </div>
      ) : null}
      {isSchedule ? (
        <span className={`status-pill ${available ? 'status-ok' : 'status-warn'}`}>
          {available ? 'Disponible' : 'Sin cupo'}
        </span>
      ) : null}
    </article>
  );
}
