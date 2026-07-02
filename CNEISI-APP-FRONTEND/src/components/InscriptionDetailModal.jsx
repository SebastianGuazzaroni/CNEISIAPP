import FeedbackForm from './FeedbackForm';
import { FEEDBACK_QUESTIONS } from '../utils/feedbackQuestions';
import { isFeedbackAvailable, normalizeEvent } from '../utils/eventUtils';

function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('es-AR');
}

export default function InscriptionDetailModal({
  item,
  feedback,
  onClose,
  onFeedbackSuccess,
  onFeedbackError,
}) {
  if (!item) return null;

  const event = normalizeEvent(item.evento || item.event);
  const feedbackAvailable = isFeedbackAvailable(event);
  const hasFeedback = Boolean(feedback);

  return (
    <div className="inscription-detail-modal" role="dialog" aria-modal="true">
      <div className="glass-card p-4 w-100" style={{ maxWidth: '520px', maxHeight: '90vh', overflow: 'auto' }}>
        <h3 className="h5 fw-bold">Detalle de inscripción</h3>
        <dl className="row g-2 small my-3">
          <div className="col-sm-6">
            <dt className="text-secondary">ID inscripción</dt>
            <dd>{item.id || item.inscriptionId}</dd>
          </div>
          <div className="col-sm-6">
            <dt className="text-secondary">Evento</dt>
            <dd>{event.titulo}</dd>
          </div>
          <div className="col-sm-6">
            <dt className="text-secondary">Tipo</dt>
            <dd>{event.tipo || 'GENERAL'}</dd>
          </div>
          <div className="col-sm-6">
            <dt className="text-secondary">Orador</dt>
            <dd>{event.orador}</dd>
          </div>
          <div className="col-sm-6">
            <dt className="text-secondary">Sala</dt>
            <dd>{event.sala}</dd>
          </div>
          <div className="col-sm-6">
            <dt className="text-secondary">Horario</dt>
            <dd>{event.horaInicio} - {event.horaFin}</dd>
          </div>
          <div className="col-sm-6">
            <dt className="text-secondary">Estado</dt>
            <dd>{item.estado || 'confirmada'}</dd>
          </div>
          <div className="col-sm-6">
            <dt className="text-secondary">Fecha de inscripción</dt>
            <dd>{formatDateTime(item.fechaInscripcion)}</dd>
          </div>
        </dl>

        {hasFeedback ? (
          <div className="glass-card p-3 mb-3">
            <h4 className="h6 fw-bold">Tu feedback</h4>
            {FEEDBACK_QUESTIONS.map((question, index) => (
              <div key={question} className="d-flex justify-content-between gap-3 py-1 small">
                <span>{question}</span>
                <strong className="text-warning">{feedback[`respuesta${index + 1}`]}</strong>
              </div>
            ))}
          </div>
        ) : feedbackAvailable ? (
          <FeedbackForm
            eventoId={event.id}
            onSuccess={onFeedbackSuccess}
            onError={onFeedbackError}
          />
        ) : (
          <p className="text-secondary small">
            El feedback estará disponible 15 minutos después de finalizado el evento.
          </p>
        )}

        <button type="button" className="btn btn-secondary mt-3" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
