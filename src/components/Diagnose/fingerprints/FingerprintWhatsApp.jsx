// Pattern 03 · Der WhatsApp-Auftragsstrom
// Cascading message bubbles (photos, voice memos, text) flowing diagonally,
// converging into a narrow funnel labeled "manuell abschreiben · abends",
// dropping into a clean ERP box. Massive WhatsApp speech-bubble watermark.

const BUBBLES = [
  { x: 380, y: 75,  w: 220, h: 44, kind: 'FOTO',  text: 'BV-2419 fertig 🤷', highlight: false },
  { x: 460, y: 135, w: 160, h: 44, kind: 'VOICE 0:24', text: null, highlight: false },
  { x: 320, y: 195, w: 280, h: 44, kind: 'TEXT',  text: '"Material reicht nicht für 2.OG"', highlight: false },
  { x: 480, y: 255, w: 200, h: 44, kind: 'FOTO',  text: 'Lieferschein', highlight: false },
  { x: 340, y: 315, w: 180, h: 44, kind: 'VOICE 0:43', text: null, highlight: true },
  { x: 440, y: 375, w: 240, h: 44, kind: 'TEXT',  text: '"Müller, wo bist du?"', highlight: false },
];

export default function FingerprintWhatsApp({ className = '' }) {
  return (
    <svg
      viewBox="0 0 800 600"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%' }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Speech-bubble watermark — massive, faint */}
      <g transform="translate(400, 280)" opacity="0.04" fill="none" stroke="#F5F3EE" strokeWidth="1.5">
        <path d="M -240 -160 Q -240 -200 -200 -200 L 200 -200 Q 240 -200 240 -160 L 240 100 Q 240 140 200 140 L -120 140 L -160 200 L -150 140 L -200 140 Q -240 140 -240 100 Z" />
      </g>

      {/* Header tags */}
      <text x="40" y="40"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize="10"
        fill="#D4571B" letterSpacing="0.18em">
        → DER WHATSAPP-AUFTRAGSSTROM
      </text>
      <text x="760" y="40" textAnchor="end"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize="10"
        fill="#8B847A" letterSpacing="0.18em">
        fingerprint.03 · diagnose.apion
      </text>

      {/* Bubbles cascading */}
      {BUBBLES.map((b, i) => {
        const fillStroke = b.highlight ? '#D4571B' : '#F5F3EE';
        const fillStrokeOp = b.highlight ? 1 : 0.55;
        const textColor = b.highlight ? '#D4571B' : '#F5F3EE';
        return (
          <g key={i}>
            {/* Bubble outline (rounded rect) */}
            <rect
              x={b.x} y={b.y} width={b.w} height={b.h}
              rx="22" ry="22"
              fill="#08070A"
              stroke={fillStroke}
              strokeWidth="0.7"
              strokeOpacity={fillStrokeOp}
            />
            {/* Kind tag (mono, small, left-aligned inside bubble) */}
            <text x={b.x + 16} y={b.y + 18}
              fontFamily="JetBrains Mono, SF Mono, monospace" fontSize="9"
              fill="#8B847A" letterSpacing="0.12em">
              [{b.kind}]
            </text>
            {/* Content (mono or display, depending) */}
            {b.text && (
              <text x={b.x + 16} y={b.y + 33}
                fontFamily="JetBrains Mono, SF Mono, monospace" fontSize="11"
                fill={textColor}>
                {b.text}
              </text>
            )}
            {/* For voice bubbles: render a waveform */}
            {b.kind.startsWith('VOICE') && (
              <g stroke={textColor} strokeWidth="1" strokeLinecap="round">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((j) => {
                  const h = [4, 8, 12, 6, 14, 9, 5, 10][j];
                  const wx = b.x + 16 + j * 6;
                  const wy = b.y + 33;
                  return <line key={j} x1={wx} y1={wy - h / 2} x2={wx} y2={wy + h / 2} />;
                })}
              </g>
            )}
            {/* Tiny "sender" identifier on right */}
            <text x={b.x + b.w - 16} y={b.y + 18} textAnchor="end"
              fontFamily="JetBrains Mono, SF Mono, monospace" fontSize="9"
              fill="#8B847A" opacity="0.7">
              {['Müller', 'Lager', 'Schmidt', 'Müller', 'Schmidt', 'Becker'][i]}
            </text>
          </g>
        );
      })}

      {/* Funnel / convergence */}
      <g stroke="#D4571B" strokeWidth="1" fill="none">
        {/* Two converging lines from bubble area to funnel mouth */}
        <line x1="320" y1="442" x2="380" y2="478" />
        <line x1="680" y1="442" x2="420" y2="478" />
        {/* Funnel walls down to ERP */}
        <line x1="380" y1="478" x2="380" y2="498" />
        <line x1="420" y1="478" x2="420" y2="498" />
      </g>

      {/* Funnel annotation */}
      <text x="400" y="468" textAnchor="middle"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize="10"
        fill="#D4571B" letterSpacing="0.12em">
        manuell abschreiben · abends
      </text>

      {/* ERP destination box */}
      <g>
        <rect x="320" y="500" width="160" height="44"
          fill="#08070A" stroke="#F5F3EE" strokeWidth="1.2" />
        <text x="400" y="522" textAnchor="middle"
          fontFamily="JetBrains Mono, SF Mono, monospace" fontSize="11"
          fill="#F5F3EE" letterSpacing="0.08em">
          ERP-SYSTEM
        </text>
        <text x="400" y="538" textAnchor="middle"
          fontFamily="JetBrains Mono, SF Mono, monospace" fontSize="9"
          fill="#8B847A">
          offiziell · t+1
        </text>
      </g>

      {/* Bottom annotations */}
      <text x="40" y="568"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize="9"
        fill="#8B847A" letterSpacing="0.12em">
        → Σ nachrichten / auftrag: 47
      </text>
      <text x="760" y="568" textAnchor="end"
        fontFamily="JetBrains Mono, SF Mono, monospace" fontSize="9"
        fill="#8B847A" letterSpacing="0.12em">
        davon strukturiert: 0
      </text>
    </svg>
  );
}
