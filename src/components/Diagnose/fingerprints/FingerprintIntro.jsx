// Intro-Fingerprint — die Vorschau auf die 4 Muster, bevor sie einzeln aufgedeckt werden.
// Vier dashed-outline Zellen, in jeder ein typografischer Pattern-Name als "Probestempel".
// Orange crosshair in der Mitte = der diagnostische Pivot.

export default function FingerprintIntro({ className = '' }) {
  // Atmospheric grid lines for blueprint feeling
  const gridH = Array.from({ length: 16 }, (_, i) => i * 40);
  const gridV = Array.from({ length: 21 }, (_, i) => i * 40);

  return (
    <svg
      viewBox="0 0 800 600"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%' }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Blueprint grid background */}
      <g stroke="#F5F3EE" strokeWidth="0.5" opacity="0.04">
        {gridH.map((y) => <line key={`h${y}`} x1="0" y1={y} x2="800" y2={y} />)}
        {gridV.map((x) => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="600" />)}
      </g>

      {/* Header tags */}
      <text x="40" y="40"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize="10"
        fill="#8B847A" letterSpacing="0.18em">
        MUSTERDIAGNOSE · APION
      </text>
      <text x="760" y="40" textAnchor="end"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize="10"
        fill="#8B847A" letterSpacing="0.18em">
        4 muster · 47 betriebe
      </text>

      {/* 2x2 grid of pattern preview cells */}
      {[
        { x: 80,  y: 110, no: '01', l1: 'Excel-Schatten',  l2: 'CRM' },
        { x: 420, y: 110, no: '02', l1: 'Telefon-',         l2: 'Disposition' },
        { x: 80,  y: 320, no: '03', l1: 'WhatsApp-',        l2: 'Auftragsstrom' },
        { x: 420, y: 320, no: '04', l1: 'Drei-Quellen-',    l2: 'Sync' },
      ].map((cell, i) => (
        <g key={i}>
          <rect
            x={cell.x} y={cell.y} width="300" height="180"
            fill="none" stroke="#F5F3EE" strokeWidth="0.5"
            strokeDasharray="2 4" opacity="0.45"
          />
          <text x={cell.x + 24} y={cell.y + 32}
            fontFamily="JetBrains Mono, SF Mono, monospace" fontSize="10"
            fill="#8B847A" letterSpacing="0.18em">
            muster {cell.no}
          </text>
          <text x={cell.x + 24} y={cell.y + 78}
            fontFamily="Newsreader, Iowan Old Style, Charter, Georgia, serif"
            fontSize="22" fontWeight="300" fill="#F5F3EE"
            letterSpacing="-0.01em">
            {cell.l1}
          </text>
          <text x={cell.x + 24} y={cell.y + 108}
            fontFamily="Newsreader, Iowan Old Style, Charter, Georgia, serif"
            fontSize="22" fontWeight="300" fill="#F5F3EE"
            letterSpacing="-0.01em">
            {cell.l2}
          </text>
          <text x={cell.x + 24} y={cell.y + 158}
            fontFamily="JetBrains Mono, SF Mono, monospace" fontSize="9"
            fill="#8B847A" opacity="0.7" letterSpacing="0.08em">
            → pattern verified
          </text>
        </g>
      ))}

      {/* Orange crosshair at the pivot of the 4 cells */}
      <g stroke="#D4571B" strokeWidth="1.2">
        <line x1="385" y1="300" x2="415" y2="300" />
        <line x1="400" y1="285" x2="400" y2="315" />
      </g>
      <circle cx="400" cy="300" r="2.5" fill="#D4571B" />

      {/* Bottom tagline */}
      <text x="400" y="555" textAnchor="middle"
        fontFamily="Newsreader, serif" fontSize="13" fontStyle="italic"
        fill="#8B847A">
        gleiche pathologie · vier symptome
      </text>
    </svg>
  );
}
