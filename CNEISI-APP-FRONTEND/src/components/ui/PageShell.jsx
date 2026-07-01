export default function PageShell({ title, description, actions, children }) {
  return (
    <div className="page-shell">
      <div className="page-shell-header">
        <div>
          <h1>{title}</h1>
          {description ? <p>{description}</p> : null}
        </div>
        {actions ? <div className="page-shell-actions">{actions}</div> : null}
      </div>
      <div className="page-shell-content">{children}</div>
    </div>
  );
}
