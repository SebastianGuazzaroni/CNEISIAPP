export default function EmptyState({ message, description, icon }) {
  return (
    <div className="empty-state-card">
      {icon ? <div className="empty-state-icon">{icon}</div> : null}
      <p className="empty-state-message">{message}</p>
      {description ? <p className="empty-state-description">{description}</p> : null}
    </div>
  );
}
