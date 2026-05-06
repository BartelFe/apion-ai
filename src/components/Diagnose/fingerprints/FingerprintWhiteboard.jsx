// Pattern 04 · Die Drei-Quellen-Sync
// Whiteboard (left, hand-drawn style) + Excel (center, cell-grid) + Outlook
// (right, calendar-blocks). Orange arrows between them with sync cadence
// labels. One discrepancy highlighted in orange. Background: faint redundancy
// pattern (parallel lines).

export default function FingerprintWhiteboard({ className = '', mobile = false }) {
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
      {/* Background — faint horizontal parallel lines suggesting redundancy */}
      <g stroke="#F5F3EE" strokeWidth="0.5" opacity="0.04">
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={i} x1="0" y1={30 + i * 30} x2="800" y2={30 + i * 30} />
        ))}
      </g>

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

      {/* Panel labels (above each panel) */}
      <text x="150" y="100" textAnchor="middle"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(11)}
        fill="#F5F3EE" letterSpacing="0.12em">
        WHITEBOARD
      </text>
      <text x="150" y="116" textAnchor="middle"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(9)}
        fill="#8B847A">büro · physisch</text>

      <text x="400" y="100" textAnchor="middle"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(11)}
        fill="#F5F3EE" letterSpacing="0.12em">
        EXCEL
      </text>
      <text x="400" y="116" textAnchor="middle"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(9)}
        fill="#8B847A">server · share</text>

      <text x="650" y="100" textAnchor="middle"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(11)}
        fill="#F5F3EE" letterSpacing="0.12em">
        OUTLOOK
      </text>
      <text x="650" y="116" textAnchor="middle"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize={fs(9)}
        fill="#8B847A">cloud · privat</text>

      {/* Panel 1 — Whiteboard (hand-drawn feel) */}
      <g>
        {/* Outline — slightly imperfect (multiple subtle strokes) */}
        <rect x="40" y="135" width="220" height="280"
          fill="#08070A" stroke="#F5F3EE" strokeWidth="0.7" />
        <rect x="42" y="137" width="216" height="276"
          fill="none" stroke="#F5F3EE" strokeWidth="0.3" opacity="0.5" />
        {/* "Day" headers */}
        <text x="70"  y="170" fontFamily="Newsreader, serif" fontSize={fs(11)}
          fill="#F5F3EE" fontStyle="italic">Mo</text>
        <text x="120" y="170" fontFamily="Newsreader, serif" fontSize={fs(11)}
          fill="#F5F3EE" fontStyle="italic">Di</text>
        <text x="170" y="170" fontFamily="Newsreader, serif" fontSize={fs(11)}
          fill="#F5F3EE" fontStyle="italic">Mi</text>
        <text x="215" y="170" fontFamily="Newsreader, serif" fontSize={fs(11)}
          fill="#F5F3EE" fontStyle="italic">Do</text>
        {/* Horizontal divider */}
        <line x1="55" y1="180" x2="245" y2="180"
          stroke="#F5F3EE" strokeWidth="0.5" opacity="0.4" />
        {/* Worker names — handwritten style (Newsreader italic, irregular y) */}
        <g fontFamily="Newsreader, serif" fontSize="13" fill="#F5F3EE" fontStyle="italic">
          <text x="62"  y="208">Müller</text>
          <text x="115" y="210">Müller</text>
          <text x="166" y="207">Schmidt</text>
          <text x="218" y="209">Becker</text>

          <text x="62"  y="240">Becker</text>
          <text x="113" y="242">Becker</text>
          <text x="167" y="240">Müller</text>
          <text x="216" y="241">—</text>

          {/* Crossed-out entry (eraser pass) */}
          <text x="62" y="272" opacity="0.45">Schmidt</text>
          <line x1="58" y1="269" x2="105" y2="266"
            stroke="#F5F3EE" strokeWidth="1.5" opacity="0.6" />
          <text x="115" y="272">Schmidt</text>
          <text x="167" y="271">Becker</text>
          <text x="218" y="270">Müller</text>

          <text x="62"  y="304">Becker</text>
          <text x="115" y="305">Müller</text>
          <text x="167" y="303">—</text>
          <text x="218" y="304">Schmidt</text>
        </g>
        {/* "Eraser smudge" — light grey ellipse */}
        <ellipse cx="180" cy="350" rx="48" ry="14"
          fill="#F5F3EE" opacity="0.06" />
        <text x="160" y="392"
          fontFamily="Newsreader, serif" fontSize={fs(11)} fontStyle="italic"
          fill="#8B847A">letzte Änderung: gestern</text>
      </g>

      {/* Panel 2 — Excel (clean cell grid) */}
      <g>
        <rect x="290" y="135" width="220" height="280"
          fill="#08070A" stroke="#F5F3EE" strokeWidth="0.7" />
        {/* Cell grid */}
        <g stroke="#F5F3EE" strokeWidth="0.3" opacity="0.4">
          {/* Column dividers */}
          <line x1="340" y1="135" x2="340" y2="415" />
          <line x1="395" y1="135" x2="395" y2="415" />
          <line x1="450" y1="135" x2="450" y2="415" />
          {/* Row dividers */}
          <line x1="290" y1="180" x2="510" y2="180" />
          <line x1="290" y1="220" x2="510" y2="220" />
          <line x1="290" y1="260" x2="510" y2="260" />
          <line x1="290" y1="300" x2="510" y2="300" />
          <line x1="290" y1="340" x2="510" y2="340" />
          <line x1="290" y1="380" x2="510" y2="380" />
        </g>
        {/* Header row */}
        <text x="313" y="167" fontFamily="JetBrains Mono, monospace" fontSize={fs(10)}
          fill="#8B847A">Mo</text>
        <text x="365" y="167" fontFamily="JetBrains Mono, monospace" fontSize={fs(10)}
          fill="#8B847A">Di</text>
        <text x="420" y="167" fontFamily="JetBrains Mono, monospace" fontSize={fs(10)}
          fill="#8B847A">Mi</text>
        <text x="475" y="167" fontFamily="JetBrains Mono, monospace" fontSize={fs(10)}
          fill="#8B847A">Do</text>
        {/* Data rows — note: one cell will be highlighted orange (discrepancy) */}
        <g fontFamily="JetBrains Mono, monospace" fontSize={fs(10)} fill="#F5F3EE">
          <text x="298" y="207">Müller</text>
          <text x="350" y="207">Müller</text>
          <text x="402" y="207">Schmidt</text>
          <text x="458" y="207">Becker</text>

          <text x="298" y="247">Becker</text>
          <text x="350" y="247">Becker</text>
          <text x="402" y="247">Müller</text>
          <text x="458" y="247">—</text>

          <text x="298" y="287">Schmidt</text>
          <text x="350" y="287">Schmidt</text>
          <text x="402" y="287">Becker</text>
          {/* Discrepancy: Outlook says Schmidt, Whiteboard says Müller */}
          <rect x="450" y="270" width="60" height="30" fill="#D4571B" opacity="0.18" />
          <text x="458" y="287" fill="#D4571B">Schmidt</text>

          <text x="298" y="327">Becker</text>
          <text x="350" y="327">Müller</text>
          <text x="402" y="327">—</text>
          <text x="458" y="327">Schmidt</text>

          <text x="298" y="367">Müller</text>
          <text x="350" y="367">Becker</text>
          <text x="402" y="367">Schmidt</text>
          <text x="458" y="367">Müller</text>
        </g>
        <text x="298" y="402"
          fontFamily="JetBrains Mono, monospace" fontSize={fs(9)}
          fill="#8B847A">disposition_kw37.xlsx · v.4</text>
      </g>

      {/* Panel 3 — Outlook (calendar blocks) */}
      <g>
        <rect x="540" y="135" width="220" height="280"
          fill="#08070A" stroke="#F5F3EE" strokeWidth="0.7" />
        {/* Day columns */}
        <g stroke="#F5F3EE" strokeWidth="0.3" opacity="0.35">
          <line x1="595" y1="135" x2="595" y2="415" />
          <line x1="650" y1="135" x2="650" y2="415" />
          <line x1="705" y1="135" x2="705" y2="415" />
        </g>
        {/* Time labels left */}
        <g fontFamily="JetBrains Mono, monospace" fontSize={fs(8)} fill="#8B847A">
          <text x="548" y="195">07</text>
          <text x="548" y="245">10</text>
          <text x="548" y="295">13</text>
          <text x="548" y="345">16</text>
        </g>
        {/* Appointment blocks */}
        <g fontFamily="JetBrains Mono, monospace" fontSize={fs(9)} fill="#F5F3EE">
          {/* Mo */}
          <rect x="572" y="186" width="20" height="100" fill="#F5F3EE" opacity="0.12" stroke="#F5F3EE" strokeWidth="0.4" />
          <text x="582" y="232" textAnchor="middle">Mü</text>
          {/* Di */}
          <rect x="627" y="186" width="20" height="60" fill="#F5F3EE" opacity="0.12" stroke="#F5F3EE" strokeWidth="0.4" />
          <text x="637" y="218" textAnchor="middle">Mü</text>
          <rect x="627" y="260" width="20" height="60" fill="#F5F3EE" opacity="0.12" stroke="#F5F3EE" strokeWidth="0.4" />
          <text x="637" y="293" textAnchor="middle">Be</text>
          {/* Mi — DISCREPANCY: orange block, says Müller (different from Excel) */}
          <rect x="682" y="186" width="20" height="120" fill="#D4571B" opacity="0.25" stroke="#D4571B" strokeWidth="0.6" />
          <text x="692" y="248" textAnchor="middle" fill="#D4571B">Mü</text>
          {/* Do */}
          <rect x="737" y="246" width="20" height="80" fill="#F5F3EE" opacity="0.12" stroke="#F5F3EE" strokeWidth="0.4" />
          <text x="747" y="290" textAnchor="middle">Sc</text>
        </g>
        <text x="548" y="402"
          fontFamily="JetBrains Mono, monospace" fontSize={fs(9)}
          fill="#8B847A">m.weber@firma.de · privat</text>
      </g>

      {/* Sync arrows BETWEEN panels (orange, top of section) */}
      <g stroke="#D4571B" strokeWidth="1" fill="none">
        {/* Whiteboard <-> Excel */}
        <line x1="262" y1="200" x2="288" y2="200" />
        <line x1="288" y1="220" x2="262" y2="220" />
        <polygon points="288,200 282,196 282,204" fill="#D4571B" />
        <polygon points="262,220 268,216 268,224" fill="#D4571B" />

        {/* Excel <-> Outlook */}
        <line x1="512" y1="200" x2="538" y2="200" />
        <line x1="538" y1="220" x2="512" y2="220" />
        <polygon points="538,200 532,196 532,204" fill="#D4571B" />
        <polygon points="512,220 518,216 518,224" fill="#D4571B" />
      </g>

      {/* Sync labels below arrows */}
      <g fontFamily="JetBrains Mono, monospace" fontSize={fs(9)} fill="#8B847A">
        <text x="275" y="245" textAnchor="middle">morgens</text>
        <text x="275" y="258" textAnchor="middle">per hand</text>
        <text x="525" y="245" textAnchor="middle">abends</text>
        <text x="525" y="258" textAnchor="middle">copy/paste</text>
      </g>

      {/* Curved long-arc arrow Whiteboard → Outlook over the top */}
      <path
        d="M 150 135 Q 400 60 650 135"
        stroke="#D4571B" strokeWidth="0.7" strokeDasharray="3 4" fill="none"
        opacity="0.6"
      />
      <text x="400" y="78" textAnchor="middle"
        fontFamily="Newsreader, serif" fontSize={fs(12)} fontStyle="italic"
        fill="#8B847A">
        wenn jemand fragt
      </text>

      {/* Bottom annotations */}
      <text x="40" y="465"
        fontFamily="JetBrains Mono, monospace" fontSize={fs(10)}
        fill="#F5F3EE" letterSpacing="0.04em">
        → wer hat recht?
      </text>
      <text x="40" y="485"
        fontFamily="Newsreader, serif" fontSize="13" fontStyle="italic"
        fill="#8B847A">
        Mittwoch 10:00 · drei Antworten, eine Wahrheit, niemand weiß welche.
      </text>

      {/* Bottom-right summary */}
      <text x="40" y="568"
        fontFamily="JetBrains Mono, monospace" fontSize={fs(9)}
        fill="#8B847A" letterSpacing="0.12em">
        → Σ sync-arbeit / woche: 8.4 h
      </text>
      <text x="760" y="568" textAnchor="end"
        fontFamily="JetBrains Mono, monospace" fontSize={fs(9)}
        fill="#8B847A" letterSpacing="0.12em">
        master-quelle: keine
      </text>
    </svg>
  );
}
