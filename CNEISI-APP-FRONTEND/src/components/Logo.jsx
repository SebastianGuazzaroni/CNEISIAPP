export default function Logo({ large = false }) {
  return (
    <div className={large ? 'logo logo-large' : 'logo'} aria-label="CNEISI 2026">
      <span className="logo-code">&lt;</span>
      <span>CNEISI</span>
      <span className="logo-slash">/</span>
      <span className="logo-code">&gt;</span>
      <small>2026</small>
    </div>
  )
}
