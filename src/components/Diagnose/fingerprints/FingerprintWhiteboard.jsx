// Pattern 04 · Die Drei-Quellen-Sync — vereinfachte Version
//
// Hypothese: drei Systeme, ein konkreter Moment, drei verschiedene Antworten.
//
// Die alte Version zeigte volle Wochenkalender (Mo–Do mit 4 Mitarbeitern pro
// Tag pro Quelle), Sync-Pfeile zwischen Panels, einen "wenn jemand fragt"-
// Bogen, Eraser-Smudges, Discrepancy-Highlights. Insgesamt 5+ separate
// visuelle Schichten. Die Kernhypothese war erst nach mehreren Sekunden
// Lesen erkennbar.
//
// Diese Version fokussiert auf EINEN Moment: "Mittwoch 10:00 · BV-2419 —
// wer arbeitet dran?". Drei Panels (Whiteboard / Excel / Outlook), jedes
// mit EINEM Namen drin, drei VERSCHIEDENE Namen. Sofort lesbar:
// drei Antworten, eine Wahrheit, niemand weiß welche.
//
// Visuell-typografische Differenzierung pro System:
// - Whiteboard: Newsreader italic, "handgeschrieben"
// - Excel:      Mono mit Mini-Zellgrid, "tabellarisch"
// - Outlook:    Mono in Kalenderblock, "geblockt"

export default function FingerprintWhiteboard({ className = '', mobile = false }) {
  // Mobile-Font-Scale, s. FingerprintIntro für Begründung.
  const fs = (n) => (mobile && n < 13 ? n + 4 : n);

  const PANELS = [
    { title: 'WHITEBOARD', sub: 'büro · physisch',  cx: 160, answer: 'Müller',  variant: 'whiteboard', meta: 'letzte Änderung: gestern' },
    { title: 'EXCEL',      sub: 'server · v.4',     cx: 400, answer: 'Schmidt', variant: 'excel',      meta: 'disposition_kw37.xlsx · v.4' },
    { title: 'OUTLOOK',    sub: 'cloud · privat',   cx: 640, answer: 'Becker',  variant: 'outlook',    meta: 'm.weber@firma.de · privat' },
  ];

  return (
    <svg
      viewBox="0 0 800 600"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%' }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Header */}
      <text x="40" y="40"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(10)}
        fill="#D4571B" letterSpacing="0.18em">
        → DIE DREI-QUELLEN-SYNC
      </text>
      <text x="760" y="40" textAnchor="end"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(10)}
        fill="#8B847A" letterSpacing="0.18em">
        fingerprint.04 · diagnose.apion
      </text>

      {/* Hero question — die Frage trägt die ganze Section */}
      <text x="400" y="105" textAnchor="middle"
        fontFamily="Newsreader, Iowan Old Style, Charter, Georgia, serif"
        fontStyle="italic" fontWeight="300"
        fontSize="36" fill="#F5F3EE" letterSpacing="-0.01em">
        wer hat recht?
      </text>
      <text x="400" y="132" textAnchor="middle"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(10)}
        fill="#8B847A" letterSpacing="0.18em">
        MITTWOCH 10:00 · BV-2419 · MONTAGE
      </text>

      {/* Three panels */}
      {PANELS.map((p, i) => (
        <g key={i}>
          {/* Panel title + sub */}
          <text x={p.cx} y="190" textAnchor="middle"
            fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(11)}
            fontWeight="500" fill="#F5F3EE" letterSpacing="0.18em">
            {p.title}
          </text>
          <text x={p.cx} y="208" textAnchor="middle"
            fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(9)}
            fill="#8B847A">
            {p.sub}
          </text>

          {/* Box (uniform 160 × 140) */}
          <rect x={p.cx - 80} y="232" width="160" height="140"
            fill="#08070A" stroke="#F5F3EE" strokeWidth="0.7" />

          {/* Variant-specific answer rendering */}
          {p.variant === 'whiteboard' && (
            <>
              {/* Subtle horizontal "line" hint — like a whiteboard guide line */}
              <line x1={p.cx - 60} y1="278" x2={p.cx + 60} y2="278"
                stroke="#F5F3EE" strokeWidth="0.4" opacity="0.18" strokeDasharray="2 4" />
              <text x={p.cx} y="320" textAnchor="middle"
                fontFamily="Newsreader, Iowan Old Style, Charter, Georgia, serif"
                fontStyle="italic" fontWeight="300"
                fontSize="36" fill="#F5F3EE" letterSpacing="-0.01em">
                {p.answer}
              </text>
            </>
          )}
          {p.variant === 'excel' && (
            <>
              {/* Mini cell-grid suggestion: one horizontal + one vertical line */}
              <line x1={p.cx - 80} y1="280" x2={p.cx + 80} y2="280"
                stroke="#F5F3EE" strokeWidth="0.4" opacity="0.32" />
              <line x1={p.cx} y1="232" x2={p.cx} y2="372"
                stroke="#F5F3EE" strokeWidth="0.4" opacity="0.32" />
              <text x={p.cx} y="320" textAnchor="middle"
                fontFamily="JetBrains Mono, SF Mono, monospace"
                fontSize="26" fontWeight="400" fill="#F5F3EE">
                {p.answer}
              </text>
            </>
          )}
          {p.variant === 'outlook' && (
            <>
              {/* Calendar block — appointment in cloud */}
              <rect x={p.cx - 52} y="266" width="104" height="76"
                fill="#F5F3EE" fillOpacity="0.10"
                stroke="#F5F3EE" strokeWidth="0.4" />
              <text x={p.cx} y="313" textAnchor="middle"
                fontFamily="JetBrains Mono, SF Mono, monospace"
                fontSize="22" fontWeight="500" fill="#F5F3EE">
                {p.answer}
              </text>
            </>
          )}

          {/* Meta line below box */}
          <text x={p.cx} y="395" textAnchor="middle"
            fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(9)}
            fill="#8B847A" letterSpacing="0.04em">
            {p.meta}
          </text>
        </g>
      ))}

      {/* Orange unifying connector — die drei Antworten werden zusammengeführt */}
      <g stroke="#D4571B" fill="none">
        {/* Tickmarks above the line at each panel center */}
        <line x1="160" y1="425" x2="160" y2="437" strokeWidth="1" />
        <line x1="400" y1="425" x2="400" y2="437" strokeWidth="1" />
        <line x1="640" y1="425" x2="640" y2="437" strokeWidth="1" />
        {/* Horizontal connector — dashed, subtle */}
        <line x1="160" y1="437" x2="640" y2="437"
          strokeWidth="0.8" strokeDasharray="3 3" opacity="0.55" />
        {/* Downward line into punchline */}
        <line x1="400" y1="437" x2="400" y2="463" strokeWidth="1" />
        {/* Arrow tip */}
        <polygon points="400,468 396,460 404,460" fill="#D4571B" />
      </g>

      {/* Punchline — zwei Zeilen, italic editorial */}
      <text x="400" y="495" textAnchor="middle"
        fontFamily="Newsreader, Iowan Old Style, Charter, Georgia, serif"
        fontStyle="italic" fontWeight="300"
        fontSize="18" fill="#F5F3EE">
        drei Antworten — eine Wahrheit
      </text>
      <text x="400" y="520" textAnchor="middle"
        fontFamily="Newsreader, Iowan Old Style, Charter, Georgia, serif"
        fontStyle="italic" fontWeight="300"
        fontSize="18" fill="#8B847A">
        niemand weiß, welche.
      </text>

      {/* Footer summary */}
      <text x="40" y="568"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(9)}
        fill="#8B847A" letterSpacing="0.12em">
        → Σ sync-arbeit / woche: 8.4 h
      </text>
      <text x="760" y="568" textAnchor="end"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(9)}
        fill="#8B847A" letterSpacing="0.12em">
        master-quelle: keine
      </text>
    </svg>
  );
}
