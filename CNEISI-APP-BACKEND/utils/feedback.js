const FEEDBACK_DELAY_MS = 15 * 60 * 1000;

const FEEDBACK_QUESTIONS = [
  'Relevancia del contenido',
  'Claridad de la exposición',
  'Utilidad de la actividad',
  'Organización del evento',
  'Probabilidad de recomendarla',
];

const VALID_ESTADOS = ['confirmada', 'cancelada', 'pendiente'];

function getEventEndDate(evento) {
  if (evento.fechaFin) {
    return new Date(evento.fechaFin);
  }
  const start = new Date(evento.fecha);
  start.setMinutes(start.getMinutes() + 90);
  return start;
}

function canSubmitFeedback(evento) {
  const end = getEventEndDate(evento);
  if (Number.isNaN(end.getTime())) return false;
  return Date.now() >= end.getTime() + FEEDBACK_DELAY_MS;
}

function isValidScore(value) {
  const num = Number(value);
  return Number.isInteger(num) && num >= 0 && num <= 5;
}

module.exports = {
  FEEDBACK_DELAY_MS,
  FEEDBACK_QUESTIONS,
  VALID_ESTADOS,
  getEventEndDate,
  canSubmitFeedback,
  isValidScore,
};
