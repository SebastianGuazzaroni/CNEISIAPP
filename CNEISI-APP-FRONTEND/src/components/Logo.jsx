import cneisiLogo from '../style/img/optimized.webp';
import utnLogo from '../style/img/Logo_Blanco.png';

export default function Logo({ large = false, showUtn = false, centered = false }) {
  return (
    <div
      className={`brand-logos ${centered ? 'w-100' : ''}`}
      aria-label="CNEISI 2026 - UTN FRSF"
    >
      <img
        src={cneisiLogo}
        alt="Logo CNEISI 2026"
        className={`brand-logo-cneisi ${large ? 'large' : ''}`}
      />
      {showUtn ? (
        <img
          src={utnLogo}
          alt="UTN Facultad Regional San Francisco"
          className={`brand-logo-utn ${large ? 'large' : ''}`}
        />
      ) : null}
    </div>
  );
}
