export default function Logo({ size = 28, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="0.8" strokeLinecap="round">
        <path d="M3 3 L3 11 M3 3 L11 3" />
        <path d="M57 3 L57 11 M57 3 L49 3" />
        <path d="M3 57 L3 49 M3 57 L11 57" />
        <path d="M57 57 L57 49 M57 57 L49 57" />
      </g>
      <g transform="translate(30 30)" stroke="currentColor" strokeWidth="0.6" fill="none">
        <polygon points="-14,-8 0,-16 14,-8 14,8 0,16 -14,8" />
        <line x1="-14" y1="-8" x2="14" y2="8" />
        <line x1="14" y1="-8" x2="-14" y2="8" />
        <line x1="0" y1="-16" x2="0" y2="16" />
      </g>
      <g fill="currentColor">
        <circle cx="16" cy="22" r="1.6" />
        <circle cx="30" cy="14" r="1.6" />
        <circle cx="44" cy="22" r="1.6" />
        <circle cx="44" cy="38" r="1.6" />
        <circle cx="30" cy="46" r="1.6" />
        <circle cx="16" cy="38" r="1.6" />
      </g>
    </svg>
  );
}
