import SectionTitle from './SectionTitle';
import EventCard from './eventCard';

export default function EventCards({ events, mode, onAction, onDetail, title, enrolledIds }) {
  return (
    <div className="d-flex flex-column gap-3">
      <SectionTitle>{title}</SectionTitle>
      <div className="d-flex flex-column gap-3">
        {events.length ? (
          events.map((event) => (
            <EventCard
              event={event}
              key={event.id}
              mode={mode}
              isEnrolled={enrolledIds?.has(String(event.id))}
              onAction={onAction}
              onDetail={onDetail}
            />
          ))
        ) : (
          <div className="glass-card p-4 text-center text-secondary">Sin eventos</div>
        )}
      </div>
    </div>
  );
}
