export default function ConfirmDialog({ title, onConfirm, onCancel, destructive = false }) {
  if (!title) return null;

  return (
    <div className="confirm-overlay">
      <div className="glass-card p-4 w-100" style={{ maxWidth: '420px' }}>
        <p className="mb-4 fs-5">{title}</p>
        <div className="d-flex gap-2 justify-content-end flex-wrap">
          <button className="btn btn-secondary" type="button" onClick={onCancel}>
            No
          </button>
          <button
            className={destructive ? 'btn btn-danger' : 'btn btn-success'}
            type="button"
            onClick={onConfirm}
          >
            Sí
          </button>
        </div>
      </div>
    </div>
  );
}
