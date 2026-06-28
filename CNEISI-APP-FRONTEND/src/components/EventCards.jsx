import React from 'react'
import SectionTitle from './SectionTitle'
import EventCard from './EventCard'

export default function EventCards({ events, mode, onAction, title }) {
  return (
    <div className="cards-view">
      <SectionTitle>{title}</SectionTitle>
      <div className="event-list">
        {events.length ? (
          events.map((event) => <EventCard event={event} key={event.id} mode={mode} onAction={onAction} />)
        ) : (
          <div className="empty-state">Sin inscripciones</div>
        )}
      </div>
    </div>
  )
}
