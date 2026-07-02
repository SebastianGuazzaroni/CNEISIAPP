import { FEEDBACK_DELAY_MS } from './feedbackQuestions';

export const emptyTalkForm = {
  titulo: '',
  descripcion: '',
  orador: '',
  fecha: '',
  horaInicio: '',
  horaFin: '',
  sala: '',
  cupoMaximo: '',
  tipo: 'CHARLA',
};

export const emptyAdminForm = {
  nombreApellido: '',
  email: '',
};

export function getEventEndDate(event) {
  if (event.fechaFin) {
    return new Date(event.fechaFin);
  }
  const start = new Date(event.fecha);
  if (Number.isNaN(start.getTime())) return new Date();
  start.setMinutes(start.getMinutes() + 90);
  return start;
}

export function isFeedbackAvailable(event) {
  const end = getEventEndDate(event);
  if (Number.isNaN(end.getTime())) return false;
  return Date.now() >= end.getTime() + FEEDBACK_DELAY_MS;
}

export function normalizeEvent(event) {
  const date = new Date(event.fecha);
  const isValidDate = !Number.isNaN(date.getTime());
  const start = isValidDate ? date : new Date();
  const end = getEventEndDate(event);
  const fallbackTitle = event.titulo || 'CHARLA';
  const horaInicio = event.horaInicio || formatTime(start);
  const horaFin = event.horaFin || formatTime(end);

  return {
    ...event,
    titulo: fallbackTitle.toUpperCase().startsWith('CHARLA') ? fallbackTitle.toUpperCase() : fallbackTitle,
    descripcion: event.descripcion || 'Breve descripcion',
    fecha: event.fecha || start.toISOString(),
    fechaFin: event.fechaFin || end.toISOString(),
    fechaCorta: formatDate(start),
    horaInicio,
    horaFin,
    tipo: event.tipo || 'GENERAL',
    sala: event.sala || '114',
    orador: event.orador || 'Pedro Martinez',
    cupoMaximo: event.cupoMaximo || 70,
    cupoDisponible: event.cupoDisponible ?? event.cupoMaximo ?? 20,
  };
}

export function buildEventPayload(form) {
  const now = new Date();
  const fecha = form.fecha || now.toISOString().slice(0, 10);
  const horaInicio = form.horaInicio || formatTime(now);
  const horaFin = form.horaFin || addMinutes(`${fecha}T${horaInicio}:00`, 90);
  const cupo = Number(form.cupoMaximo) || 70;

  return {
    titulo: form.titulo || 'Charla',
    descripcion: form.descripcion || 'Breve descripcion',
    orador: form.orador || 'Pedro Martinez',
    fecha: `${fecha}T${horaInicio}:00`,
    fechaFin: `${fecha}T${horaFin}:00`,
    tipo: form.tipo || 'CHARLA',
    sala: form.sala || '114',
    cupoMaximo: cupo,
    cupoDisponible: cupo,
  };
}

export function toDateInput(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

export function addMinutes(value, minutes) {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  if (Number.isNaN(date.getTime())) return formatTime(new Date());
  date.setMinutes(date.getMinutes() + minutes);
  return formatTime(date);
}

function formatDate(date) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
  }).format(date);
}

function formatTime(date) {
  return new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}
