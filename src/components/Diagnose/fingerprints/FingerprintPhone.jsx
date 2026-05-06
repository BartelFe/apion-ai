// Pattern 02 · Die Telefon-Disposition
// Stylized handset at center, 6 orange spokes radiating to destination nodes
// (Lager, Baustellen, Kunde, Lieferant, Monteur). Each spoke carries time spent.
// Faint whiteboard grid + clock-face watermark behind. Sum of times = 3.7h/day.

const SPOKES = [
  { angle:  30, x: 510, y: 110, label: 'Monteur Müller', sub: 'baustelle 4',    time: '39m' },
  { angle:  80, x: 617, y: 262, label: 'Lager',          sub: 'GC-Gruppe',      time: '35m' },
  { angle: 130, x: 569, y: 442, label: 'Baustelle 1',    sub: 'klinikum süd',   time: '42m' },
  { angle: 200, x: 325, y: 507, label: 'Baustelle 2',    sub: 'wohnpark west',  time: '28m' },
  { angle: 250, x: 193, y: 375, label: 'Kunde',          sub: 'rückfragen',     time: '47m' },
  { angle: 310, x: 232, y: 159, label: 'Lieferant',      sub: 'GC-Gruppe',      time: '31m' },
];

// Position of inline time annotation: radius 145px from center, on inner side of node
const cx = 400, cy = 300;

export default function FingerprintPhone({ className = '', mobile = false }) {
  // Mobile-Font-Scale, s. FingerprintIntro für Begründung.
  const fs = (n) => (mobile && n < 13 ? n + 4 : n);

  return (
    <svg
      viewBox="0 0 800 600"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%' }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Faint whiteboard grid background */}
      <g stroke="#F5F3EE" strokeWidth="0.5" opacity="0.04">
        {[100, 200, 300, 400, 500].map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="800" y2={y} />
        ))}
        {[100, 200, 300, 400, 500, 600, 700].map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="600" />
        ))}
      </g>

      {/* Clock-face watermark — large, faint */}
      <g transform="translate(400, 300)" opacity="0.05" fill="none" stroke="#F5F3EE" strokeWidth="1.2">
        <circle cx="0" cy="0" r="280" />
        <circle cx="0" cy="0" r="262" strokeDasharray="2 8" />
        {Array.from({ length: 12 }).map((_, i) => {
          const rad = (i * 30 - 90) * Math.PI / 180;
          const x1 = Math.cos(rad) * 250;
          const y1 = Math.sin(rad) * 250;
          const x2 = Math.cos(rad) * 280;
          const y2 = Math.sin(rad) * 280;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={i % 3 === 0 ? '2' : '0.8'} />;
        })}
      </g>

      {/* Header tags */}
      <text x="40" y="40"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(10)}
        fill="#D4571B" letterSpacing="0.18em">
        → DIE TELEFON-DISPOSITION
      </text>
      <text x="760" y="40" textAnchor="end"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(10)}
        fill="#8B847A" letterSpacing="0.18em">
        fingerprint.02 · diagnose.apion
      </text>

      {/* Spokes (lines + nodes + labels) */}
      {SPOKES.map((s, i) => {
        const rad = (s.angle - 90) * Math.PI / 180;
        const x1 = cx + Math.cos(rad) * 55;
        const y1 = cy + Math.sin(rad) * 55;
        const x2 = cx + Math.cos(rad) * 215;
        const y2 = cy + Math.sin(rad) * 215;
        const tx = cx + Math.cos(rad) * 130;
        const ty = cy + Math.sin(rad) * 130;
        // Label position offset from node, away from center
        const lx = cx + Math.cos(rad) * 248;
        const ly = cy + Math.sin(rad) * 248;
        const labelAnchor = Math.cos(rad) > 0.25 ? 'start' : Math.cos(rad) < -0.25 ? 'end' : 'middle';
        const timeOffset = Math.cos(rad) > 0 ? 12 : -12;
        const timeAnchor = Math.cos(rad) > 0 ? 'start' : 'end';

        return (
          <g key={i}>
            {/* Spoke line */}
            <line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#D4571B" strokeWidth="1" />
            {/* Node circle */}
            <circle cx={x2} cy={y2} r="4.5"
              fill="#08070A" stroke="#D4571B" strokeWidth="1.2" />
            {/* Inline time label */}
            <text x={tx + timeOffset} y={ty + 4}
              fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(11)}
              fill="#D4571B" textAnchor={timeAnchor}>
              {s.time}
            </text>
            {/* Destination labels */}
            <text x={lx} y={ly}
              fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(11)}
              fill="#F5F3EE" textAnchor={labelAnchor}>
              {s.label}
            </text>
            <text x={lx} y={ly + 14}
              fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(9)}
              fill="#8B847A" textAnchor={labelAnchor}>
              {s.sub}
            </text>
          </g>
        );
      })}

      {/* Central handset — stylized */}
      <g transform={`translate(${cx}, ${cy}) rotate(-22)`}>
        <path
          d="M -42 -22 Q -54 -22 -54 -10 L -54 12 Q -54 22 -44 26 L 44 26 Q 54 22 54 12 L 54 -10 Q 54 -22 42 -22 Z"
          fill="#08070A" stroke="#F5F3EE" strokeWidth="1.5"
        />
        {/* Earpiece */}
        <circle cx="-42" cy="2" r="9"
          fill="none" stroke="#F5F3EE" strokeWidth="1" />
        <circle cx="-42" cy="2" r="3"
          fill="#F5F3EE" />
        {/* Mouthpiece */}
        <circle cx="42" cy="2" r="9"
          fill="none" stroke="#F5F3EE" strokeWidth="1" />
        <g stroke="#F5F3EE" strokeWidth="0.5">
          {[-6, -3, 0, 3, 6].map((dx) => (
            <line key={dx} x1={42 + dx} y1="-3" x2={42 + dx} y2="7" />
          ))}
        </g>
      </g>

      {/* Bottom annotations */}
      <text x="40" y="568"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(9)}
        fill="#8B847A" letterSpacing="0.12em">
        → Σ telefonzeit / tag: 3.7 h · 14 anrufe
      </text>
      <text x="760" y="568" textAnchor="end"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(9)}
        fill="#8B847A" letterSpacing="0.12em">
        verbal-kopplung statt system
      </text>
    </svg>
  );
}
