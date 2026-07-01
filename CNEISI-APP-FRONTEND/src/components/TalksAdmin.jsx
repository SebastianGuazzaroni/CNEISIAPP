import { useEffect, useState } from 'react'
import SectionTitle from './SectionTitle'

function formatDate(date) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

function formatTime(date) {
  return new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

export default function TalksAdmin({ events, onAdd, onEdit }) {
  const [currentTime, setCurrentTime] = useState(() => new Date())

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="talks-admin">
      <SectionTitle>CHARLAS</SectionTitle>
      <div className="talk-list-panel">
        {events.slice(0, 6).map((event) => (
          <button className="talk-list-item" key={event.id} type="button" onClick={() => onEdit(event)}>
            {event.titulo}
          </button>
        ))}
        <button className="primary-button add-talk" type="button" onClick={onAdd}>
          Añadir
        </button>
      </div>
      <div className="deadline-title">FECHA Y HORA LÍMITE CANCELAR INSCRIPCIONES</div>
      <div className="date-pills">
        <span>{formatDate(currentTime)}</span>
        <span>{formatTime(currentTime)}</span>
      </div>
    </div>
  )
}
