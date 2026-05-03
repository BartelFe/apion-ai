import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { NAMED_AUFTRAG } from '../constants/flows.config';

// HUD oben rechts in der Szene.
// Live counter — werden von der Choreografie via setter aktualisiert.
const DataHUD = forwardRef(function DataHUD(_, ref) {
  const [visible,    setVisible]    = useState(0);
  const [uebergaben, setUebergaben] = useState(0);
  const [stunden,    setStunden]    = useState('0.0');
  const [euro,       setEuro]       = useState(0);
  const [einsparung, setEinsparung] = useState(0);

  useImperativeHandle(ref, () => ({
    setVisible,
    setUebergaben,
    setStunden,
    setEuro,
    setEinsparung,
  }));

  return (
    <>
      {/* HUD oben rechts: live counter */}
      <div className="absolute z-20 right-5 top-20 md:right-10 md:top-28 pointer-events-none flex flex-col items-end gap-3">
        <div
          className="font-mono text-[10px] flex items-center gap-2"
          style={{ color: 'var(--fg-muted)', letterSpacing: '0.15em' }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#D4571B', animation: 'pulseHud 2s ease-in-out infinite' }}
          />
          <span>betrieb #demo · live</span>
        </div>

        {/* Sichtbar: ruhige Zahl */}
        <HudRow
          label="sichtbare verbindungen"
          value={visible}
          unit="aktiv"
        />
        {/* Übergaben — dramatisch, orange */}
        <HudRow
          label="unsichtbare übergaben"
          value={uebergaben}
          unit="erkannt"
          trace
        />
        {/* Stunden pro Woche */}
        <HudRow
          label="zeitverlust"
          value={stunden}
          unit="h / woche"
          trace
        />
        {/* € pro Jahr */}
        <HudRow
          label="kosten · jahr"
          value={`€ ${formatNumber(euro)}`}
          unit=""
          trace
        />
        {/* Akt 4: Einsparung — grün-ish über orange */}
        {einsparung > 0 && (
          <HudRow
            label="einsparung möglich"
            value={`€ ${formatNumber(einsparung)}`}
            unit="/ jahr"
            highlight
          />
        )}
      </div>

      {/* AuftragsTag — unten rechts. Identifikation mit BV-2419 */}
      <div
        className="absolute z-20 right-5 bottom-12 md:right-10 md:bottom-16 pointer-events-none max-w-[260px]"
        style={{
          background: 'rgba(245,243,238,0.04)',
          border: '0.5px solid var(--line-strong)',
          padding: '12px 14px',
          borderRadius: '2px',
          backdropFilter: 'blur(4px)',
        }}
      >
        <div
          className="font-mono text-[10px] mb-1.5 flex items-center gap-2"
          style={{ color: '#D4571B', letterSpacing: '0.15em' }}
        >
          <span className="w-1 h-1 rounded-full" style={{ background: '#D4571B' }} />
          auftrag {NAMED_AUFTRAG.id} · live
        </div>
        <div
          className="editorial-display"
          style={{ fontSize: '14px', lineHeight: 1.3, color: 'var(--fg)' }}
        >
          {NAMED_AUFTRAG.label}
        </div>
        <div
          className="font-mono text-[11px] mt-1.5 flex justify-between"
          style={{ color: 'var(--fg-muted)' }}
        >
          <span>volumen · {NAMED_AUFTRAG.volume}</span>
          <span>eingang · {NAMED_AUFTRAG.enteredAt}</span>
        </div>
      </div>

      <style>{`
        @keyframes pulseHud {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
      `}</style>
    </>
  );
});

function HudRow({ label, value, unit, trace, highlight }) {
  const color = highlight ? '#7BA86A' : trace ? '#D4571B' : 'var(--fg)';
  return (
    <div className="flex flex-col items-end gap-0.5">
      <span
        className="font-mono text-[10px]"
        style={{ color: 'var(--fg-muted)', letterSpacing: '0.12em' }}
      >
        {label}
      </span>
      <span
        className="editorial-display flex items-baseline gap-1.5"
        style={{ fontSize: 'clamp(20px, 2vw, 28px)', color, lineHeight: 1 }}
      >
        {value}
        {unit && (
          <span
            className="font-mono text-[10px]"
            style={{ color: 'var(--fg-muted)', letterSpacing: '0.05em' }}
          >
            {unit}
          </span>
        )}
      </span>
    </div>
  );
}

function formatNumber(n) {
  if (typeof n !== 'number') return n;
  return new Intl.NumberFormat('de-DE').format(n);
}

export default DataHUD;
