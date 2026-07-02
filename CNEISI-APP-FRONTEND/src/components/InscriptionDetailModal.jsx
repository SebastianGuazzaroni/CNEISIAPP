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
      <div className="inscription-detail-card glass-card">
        <h3>Detalle de inscripción</h3>
        <dl>
          <div>
            <dt>ID inscripción</dt>
            <dd>{item.id || item.inscriptionId}</dd>
          </div>
          <div>
            <dt>Evento</dt>
            <dd>{event.titulo}</dd>
          </div>
          <div>
            <dt>Tipo</dt>
            <dd>{event.tipo || 'GENERAL'}</dd>
          </div>
          <div>
            <dt>Orador</dt>
            <dd>{event.orador}</dd>
          </div>
          <div>
            <dt>Sala</dt>
            <dd>{event.sala}</dd>
          </div>
          <div>
            <dt>Horario</dt>
            <dd>
              {event.horaInicio} - {event.horaFin}
            </dd>
          </div>
          <div>
            <dt>Estado</dt>
            <dd>{item.estado || 'confirmada'}</dd>
          </div>
          <div>
            <dt>Fecha de inscripción</dt>
            <dd>{formatDateTime(item.fechaInscripcion)}</dd>
          </div>
        </dl>

        {hasFeedback ? (
          <div className="feedback-scores glass-card">
            <h4>Tu feedback</h4>
            {FEEDBACK_QUESTIONS.map((question, index) => (
              <div key={question} className="feedback-score-row">
                <span>{question}</span>
                <strong>{feedback[`respuesta${index + 1}`]}</strong>
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
          <p className="scanner-hint">
            El feedback estará disponible 15 minutos después de finalizado el evento.
          </p>
        )}

        <div className="inscription-detail-actions">
          <button type="button" className="secondary-button" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
