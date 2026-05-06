// Outro-Fingerprint — die Synthese: vier Pattern-Badges verbunden durch eine
// orange Linie, in der Mitte das Wort "DER SCHATTEN". Visualisiert: vier
// Symptome, eine Pathologie. Schliesst die Section vor der ROI-Übergabe.

export default function FingerprintOutro({ className = '', mobile = false }) {
  // Mobile-Font-Scale, s. FingerprintIntro für Begründung.
  const fs = (n) => (mobile && n < 13 ? n + 4 : n);

  // 4 corner positions for the pattern badges (cell centers)
  const corners = [
    { cx: 230, cy: 200, no: '01', name: 'Excel-Schatten-CRM',     summary: '4.2 h / w' },
    { cx: 570, cy: 200, no: '02', name: 'Telefon-Disposition',    summary: '3.7 h / d' },
    { cx: 230, cy: 410, no: '03', name: 'WhatsApp-Auftragsstrom', summary: '47 / auftrag' },
    { cx: 570, cy: 410, no: '04', name: 'Drei-Quellen-Sync',      summary: '8.4 h / w' },
  ];

  return (
    <svg
      viewBox="0 0 800 600"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%' }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Faint blueprint grid */}
      <g stroke="#F5F3EE" strokeWidth="0.5" opacity="0.04">
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="800" y2={i * 40} />
        ))}
        {Array.from({ length: 21 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="600" />
        ))}
      </g>

      {/* Header */}
      <text x="40" y="40"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(10)}
        fill="#D4571B" letterSpacing="0.18em">
        → SYNTHESE
      </text>
      <text x="760" y="40" textAnchor="end"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(10)}
        fill="#8B847A" letterSpacing="0.18em">
        diagnose abgeschlossen
      </text>

      {/* Connecting orange polygon between the 4 corners */}
      <polygon
        points="230,200 570,200 570,410 230,410"
        fill="#D4571B" fillOpacity="0.04"
        stroke="#D4571B" strokeWidth="1"
        strokeDasharray="6 3"
      />

      {/* Diagonals through center */}
      <g stroke="#D4571B" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.6">
        <line x1="230" y1="200" x2="570" y2="410" />
        <line x1="570" y1="200" x2="230" y2="410" />
      </g>

      {/* Pattern badges at corners */}
      {corners.map((c, i) => (
        <g key={i}>
          <circle cx={c.cx} cy={c.cy} r="6"
            fill="#08070A" stroke="#D4571B" strokeWidth="1.5" />
          <circle cx={c.cx} cy={c.cy} r="2" fill="#D4571B" />

          {/* Connector dot label offsets */}
          <text x={c.cx} y={c.cy - 24} textAnchor="middle"
            fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(10)}
            fill="#8B847A" letterSpacing="0.18em">
            muster {c.no}
          </text>
          <text x={c.cx} y={c.cy + 28} textAnchor="middle"
            fontFamily="Newsreader, Iowan Old Style, Charter, Georgia, serif"
            fontSize="17" fontWeight="300" fill="#F5F3EE"
            letterSpacing="-0.01em">
            {c.name}
          </text>
          <text x={c.cx} y={c.cy + 50} textAnchor="middle"
            fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(10)}
            fill="#D4571B" letterSpacing="0.04em">
            {c.summary}
          </text>
        </g>
      ))}

      {/* Center: the shadow */}
      <g>
        <circle cx="400" cy="305" r="38"
          fill="#08070A" stroke="#D4571B" strokeWidth="1.2" />
        <circle cx="400" cy="305" r="32"
          fill="none" stroke="#D4571B" strokeWidth="0.5"
          strokeDasharray="2 3" opacity="0.6" />
        <text x="400" y="302" textAnchor="middle"
          fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(9)}
          fill="#D4571B" letterSpacing="0.18em">
          DER
        </text>
        <text x="400" y="316" textAnchor="middle"
          fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(11)}
          fill="#D4571B" letterSpacing="0.18em">
          SCHATTEN
        </text>
      </g>

      {/* Bottom tagline */}
      <text x="400" y="510" textAnchor="middle"
        fontFamily="Newsreader, serif" fontSize="15" fontStyle="italic"
        fill="#F5F3EE">
        vier Symptome.
      </text>
      <text x="400" y="535" textAnchor="middle"
        fontFamily="Newsreader, serif" fontSize="15" fontStyle="italic"
        fill="#F5F3EE">
        eine Pathologie.
      </text>

      {/* Bottom annotations */}
      <text x="40" y="568"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(9)}
        fill="#8B847A" letterSpacing="0.12em">
        → diagnose vollständig · n=47 betriebe
      </text>
      <text x="760" y="568" textAnchor="end"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(9)}
        fill="#D4571B" letterSpacing="0.12em">
        → was kostet er?
      </text>
    </svg>
  );
}
