export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="toast-container">
      <div className="toast-notification px-4 py-2 fw-semibold">{message}</div>
    </div>
  );
}
