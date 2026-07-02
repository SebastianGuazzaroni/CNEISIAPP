import SectionTitle from './SectionTitle'
import EventCard from './eventCard'

export default function EventCards({ events, mode, onAction, onDetail, title }) {
  return (
    <div className="cards-view">
      <SectionTitle>{title}</SectionTitle>
      <div className="event-list">
        {events.length ? (
          events.map((event) => (
            <EventCard
              event={event}
              key={event.id}
              mode={mode}
              onAction={onAction}
              onDetail={onDetail}
            />
          ))
        ) : (
          <div className="empty-state">Sin inscripciones</div>
        )}
      </div>
    </div>
  )
}
