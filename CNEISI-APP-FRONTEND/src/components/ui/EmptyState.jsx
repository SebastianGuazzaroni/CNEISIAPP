export default function EmptyState({ message, description }) {
  return (
    <div className="text-center text-secondary py-5">
      <p className="fw-semibold mb-1">{message}</p>
      {description ? <p className="small mb-0">{description}</p> : null}
    </div>
  );
}
