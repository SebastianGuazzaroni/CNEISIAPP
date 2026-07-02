export default function PageShell({ title, description, actions, children }) {
  return (
    <div className="page-shell">
      <div className="d-flex justify-content-between align-items-start gap-3 mb-4 flex-wrap">
        <div>
          <h1 className="h3 fw-bold mb-1">{title}</h1>
          {description ? <p className="text-secondary mb-0">{description}</p> : null}
        </div>
        {actions ? <div className="d-flex gap-2 flex-wrap">{actions}</div> : null}
      </div>
      <div className="d-flex flex-column gap-3">{children}</div>
    </div>
  );
}
