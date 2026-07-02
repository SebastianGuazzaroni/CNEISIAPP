import { useEffect, useState } from 'react';
import SectionTitle from './SectionTitle';

function formatDate(date) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function formatTime(date) {
  return new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export default function TalksAdmin({ events, onAdd, onEdit }) {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="d-flex flex-column gap-3">
      <SectionTitle>CHARLAS</SectionTitle>
      <div className="d-flex flex-column gap-2">
        {events.slice(0, 6).map((event) => (
          <button className="glass-card p-3 text-start" key={event.id} type="button" onClick={() => onEdit(event)}>
            {event.titulo}
          </button>
        ))}
        <button className="btn btn-cneisi" type="button" onClick={onAdd}>
          Añadir
        </button>
      </div>
      <div className="section-title">FECHA Y HORA LÍMITE CANCELAR INSCRIPCIONES</div>
      <div className="d-flex gap-2 flex-wrap">
        <span className="status-pill status-warn">{formatDate(currentTime)}</span>
        <span className="status-pill status-warn">{formatTime(currentTime)}</span>
      </div>
    </div>
  );
}
