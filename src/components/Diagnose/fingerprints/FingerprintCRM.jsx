// Pattern 01 · Der Excel-Schatten-CRM
// Central CRM box (offiziell) + 4 Excel satellites (inoffiziell), bidirectional
// orange dashed arrows showing constant manual sync. One curved unofficial-sync
// line between two Excels. Massive EXCEL watermark behind.

export default function FingerprintCRM({ className = '', mobile = false }) {
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
      {/* Massive EXCEL watermark */}
      <text x="400" y="400" textAnchor="middle"
        fontFamily="Newsreader, Iowan Old Style, Charter, Georgia, serif"
        fontSize={mobile ? 220 : 320} fontWeight="300"
        fill="#F5F3EE" fillOpacity="0.035"
        letterSpacing="-0.04em">
        EXCEL
      </text>

      {/* Fingerprint tag */}
      <text x="760" y="40" textAnchor="end"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(10)}
        fill="#8B847A" letterSpacing="0.18em">
        fingerprint.01 · diagnose.apion
      </text>
      <text x="40" y="40"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(10)}
        fill="#D4571B" letterSpacing="0.18em">
        → DER EXCEL-SCHATTEN-CRM
      </text>

      {/* CRM Box (center, official) */}
      <g>
        <rect x="340" y="270" width="120" height="60"
          fill="#08070A" stroke="#F5F3EE" strokeWidth="1.2" />
        <text x="400" y="294" textAnchor="middle"
          fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(11)}
          fill="#F5F3EE" letterSpacing="0.08em">
          CRM · SAGE
        </text>
        <text x="400" y="313" textAnchor="middle"
          fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(9)}
          fill="#8B847A" letterSpacing="0.04em">
          offiziell
        </text>
      </g>

      {/* Top Excel — Vertrieb */}
      <g>
        <rect x="335" y="80" width="130" height="50"
          fill="#08070A" stroke="#F5F3EE" strokeWidth="0.5" />
        <text x="400" y="102" textAnchor="middle"
          fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(10)}
          fill="#F5F3EE">Excel · Vertrieb</text>
        <text x="400" y="118" textAnchor="middle"
          fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(9)}
          fill="#8B847A">verkauf_2024.xlsx</text>
      </g>

      {/* Right Excel — Reklamation */}
      <g>
        <rect x="595" y="275" width="160" height="50"
          fill="#08070A" stroke="#F5F3EE" strokeWidth="0.5" />
        <text x="675" y="297" textAnchor="middle"
          fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(10)}
          fill="#F5F3EE">Excel · Reklamation</text>
        <text x="675" y="313" textAnchor="middle"
          fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(9)}
          fill="#8B847A">reklamationen.xlsx</text>
      </g>

      {/* Bottom Excel — Aufträge (the truth file) */}
      <g>
        <rect x="335" y="470" width="130" height="50"
          fill="#08070A" stroke="#F5F3EE" strokeWidth="0.5" />
        <text x="400" y="492" textAnchor="middle"
          fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(10)}
          fill="#F5F3EE">Excel · Aufträge</text>
        <text x="400" y="508" textAnchor="middle"
          fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(9)}
          fill="#D4571B">aktuelle_Liste.xlsx</text>
      </g>

      {/* Left Excel — Stammdaten */}
      <g>
        <rect x="45" y="275" width="160" height="50"
          fill="#08070A" stroke="#F5F3EE" strokeWidth="0.5" />
        <text x="125" y="297" textAnchor="middle"
          fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(10)}
          fill="#F5F3EE">Excel · Stammdaten</text>
        <text x="125" y="313" textAnchor="middle"
          fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(9)}
          fill="#8B847A">kunden.xlsx</text>
      </g>

      {/* Bidirectional orange dashed arrows (CRM ↔ each Excel) */}
      <g stroke="#D4571B" strokeWidth="1" strokeDasharray="4 3" fill="none">
        {/* CRM <-> Top */}
        <line x1="392" y1="270" x2="392" y2="130" />
        <line x1="408" y1="130" x2="408" y2="270" />
        {/* CRM <-> Right */}
        <line x1="460" y1="294" x2="595" y2="294" />
        <line x1="595" y1="306" x2="460" y2="306" />
        {/* CRM <-> Bottom */}
        <line x1="392" y1="330" x2="392" y2="470" />
        <line x1="408" y1="470" x2="408" y2="330" />
        {/* CRM <-> Left */}
        <line x1="340" y1="294" x2="205" y2="294" />
        <line x1="205" y1="306" x2="340" y2="306" />
      </g>

      {/* Arrow tips */}
      <g fill="#D4571B">
        <polygon points="392,272 388,265 396,265" />
        <polygon points="408,128 404,135 412,135" />
        <polygon points="593,294 587,290 587,298" />
        <polygon points="462,306 468,302 468,310" />
        <polygon points="392,468 388,461 396,461" />
        <polygon points="408,332 404,339 412,339" />
        <polygon points="207,294 213,290 213,298" />
        <polygon points="338,306 332,302 332,310" />
      </g>

      {/* Cycle annotations */}
      <g fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(9)} fill="#8B847A">
        <text x="425" y="200">tägl. 3x</text>
        <text x="525" y="284">wöch. 1x</text>
        <text x="425" y="405">2x täglich</text>
        <text x="225" y="284">manuell</text>
      </g>

      {/* Inoffizieller sync — handwritten-ish curve between top Excel and right Excel */}
      <path
        d="M 465 105 Q 600 130 675 275"
        stroke="#F5F3EE" strokeWidth="0.6"
        strokeDasharray="1 5" fill="none" opacity="0.50"
      />
      <text x="595" y="170"
        fontFamily="Newsreader, serif" fontStyle="italic"
        fontSize="13" fill="#8B847A">
        inoffizieller sync
      </text>
      <text x="595" y="186"
        fontFamily="Newsreader, serif" fontStyle="italic"
        fontSize={fs(11)} fill="#8B847A" opacity="0.7">
        zwischen Vertrieb &amp; Reklamation
      </text>

      {/* Bottom annotations */}
      <text x="40" y="568"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(9)}
        fill="#8B847A" letterSpacing="0.12em">
        → manuelle übergaben pro tag: 12
      </text>
      <text x="760" y="568" textAnchor="end"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(9)}
        fill="#8B847A" letterSpacing="0.12em">
        master-quelle: ?
      </text>
    </svg>
  );
}
