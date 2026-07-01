export default function ConfirmDialog({ title, onConfirm, onCancel }) {
  if (!title) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-box glass-card">
        <p>{title}</p>
        <div className="confirm-actions">
          <button className="danger-button" type="button" onClick={onConfirm}>
            Sí
          </button>
          <button type="button" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}
