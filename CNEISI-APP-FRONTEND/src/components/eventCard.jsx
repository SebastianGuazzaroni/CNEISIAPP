export default function EventCard({ event, mode, onAction, onDetail }) {
  const isEnroll = mode === 'enroll'
  const isCancel = mode === 'cancel'
  const isSchedule = mode === 'schedule'
  const isInscription = mode === 'inscription'
  const available = event.cupoDisponible > 0

  return (
    <article className="event-card">
      <header>
        <h3>{event.titulo}</h3>
        <span>{event.sala || 'Sala no definida'}</span>
      </header>
      <p>{event.descripcion}</p>
      <dl>
        <div>
          <dt>Orador</dt>
          <dd>{event.orador}</dd>
        </div>
        <div>
          <dt>Horario</dt>
          <dd>{event.horaInicio} - {event.horaFin}</dd>
        </div>
        <div>
          <dt>Cupo</dt>
          <dd>{event.cupoDisponible ?? event.cupoMaximo} disponible</dd>
        </div>
      </dl>
      {isEnroll ? (
        <button
          className="primary-button"
          type="button"
          disabled={!available}
          onClick={() => onAction && onAction(event)}
        >
          {available ? 'Inscribirse' : 'Completo'}
        </button>
      ) : null}
      {isCancel ? (
        <button className="secondary-button" type="button" onClick={() => onAction && onAction(event)}>
          Cancelar inscripción
        </button>
      ) : null}
      {isInscription ? (
        <div className="event-card-actions">
          <button className="primary-button" type="button" onClick={() => onDetail && onDetail(event)}>
            Ver detalle
          </button>
          <button className="secondary-button" type="button" onClick={() => onAction && onAction(event)}>
            Cancelar inscripción
          </button>
        </div>
      ) : null}
      {isSchedule ? (
        <span className="badge">{available ? 'Disponible' : 'Sin cupo'}</span>
      ) : null}
    </article>
  )
}
