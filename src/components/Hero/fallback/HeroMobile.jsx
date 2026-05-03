import { useEffect, useRef, useState } from 'react';
import { STATIONS } from '../constants/stations.config';
import { VISIBLE_FLOWS, SHADOW_FLOWS, NAMED_AUFTRAG, COUNTER_TARGETS } from '../constants/flows.config';

// 2D-SVG-Variante für <768px.
// Vier Akte, getriggert via IntersectionObserver auf Anchor-Divs im Scroll-Spacer.
// Keine 3D-Last, kein Bloom, kein scrub — vier diskrete Snap-Zustände.

const VIEW_W = 360;
const VIEW_H = 360;

// Mappt Welt-Pos (x, _, z) → SVG-Pixel im 2D-Layout.
// Welt: x ∈ [-8, 9], z ∈ [-6, 5]. Auf [40, 320] mappen.
function projectXY(pos) {
  const [x, , z] = pos;
  const px = ((x + 8) / 17) * (VIEW_W - 80) + 40;
  const py = ((z + 6) / 11) * (VIEW_H - 80) + 40;
  return [px, py];
}

const STATION_COORDS = Object.fromEntries(
  STATIONS.map((s) => [s.id, projectXY(s.pos)])
);

export default function HeroMobile() {
  const sectionRef = useRef(null);
  const [act, setAct] = useState(0);
  const [counters, setCounters] = useState({ uebergaben: 0, stunden: 0, euro: 0 });

  // IntersectionObserver auf 4 Anchors im Scroll-Spacer.
  useEffect(() => {
    const anchors = sectionRef.current?.querySelectorAll('[data-act-anchor]');
    if (!anchors?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const i = Number(entry.target.dataset.actAnchor);
            setAct(i);
          }
        });
      },
      { threshold: 0.5, rootMargin: '-20% 0px -20% 0px' }
    );
    anchors.forEach((a) => observer.observe(a));
    return () => observer.disconnect();
  }, []);

  // Counter-Animation pro Akt.
  useEffect(() => {
    const targets = (() => {
      if (act >= 3) return { uebergaben: COUNTER_TARGETS.uebergaben, stunden: COUNTER_TARGETS.stundenWoche, euro: COUNTER_TARGETS.euroJahr };
      if (act >= 2) return { uebergaben: COUNTER_TARGETS.uebergaben, stunden: COUNTER_TARGETS.stundenWoche * 0.6, euro: COUNTER_TARGETS.euroJahr * 0.4 };
      if (act >= 1) return { uebergaben: 12, stunden: 2.4, euro: 5200 };
      return { uebergaben: 0, stunden: 0, euro: 0 };
    })();

    const start = { ...counters };
    const dur = 800;
    const t0 = performance.now();
    let raf;
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      setCounters({
        uebergaben: Math.round(start.uebergaben + (targets.uebergaben - start.uebergaben) * e),
        stunden: parseFloat((start.stunden + (targets.stunden - start.stunden) * e).toFixed(1)),
        euro: Math.round(start.euro + (targets.euro - start.euro) * e),
      });
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [act]);

  // Akt-Visibility
  const showVisible = act >= 0;
  const showShadow  = act >= 1;
  const dimVisible  = act === 2;
  const consolidate = act === 3;

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-bg="light"
      className="relative px-5 pt-20 pb-10"
      style={{ minHeight: '100vh' }}
    >
      {/* Sticky-Container — die SVG bleibt sichtbar während die Anchors durchscrollen */}
      <div className="sticky top-16 z-10 flex flex-col gap-4">

        {/* Headline */}
        <h1
          className="editorial-display"
          style={{ fontSize: 'clamp(28px, 8vw, 38px)', lineHeight: 1.05 }}
        >
          Jeder Mittelstandsbetrieb<br />
          hat zwei Betriebe.<br />
          <span style={{ color: 'var(--fg-muted)', fontStyle: 'italic' }}>Den sichtbaren —</span><br />
          und den, der ihn{' '}
          <em style={{ fontStyle: 'italic', color: act >= 1 ? '#D4571B' : 'inherit', transition: 'color 0.4s ease' }}>
            auffrisst
          </em>.
        </h1>

        {/* SVG-Welt */}
        <div
          className="relative w-full"
          style={{
            border: '0.5px solid var(--line)',
            background: 'linear-gradient(180deg, rgba(245,243,238,0.4), rgba(229,225,216,0.5))',
            aspectRatio: '1 / 1',
          }}
        >
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="w-full h-full"
            style={{ display: 'block' }}
          >
            {/* Visible flows */}
            {showVisible && VISIBLE_FLOWS.map((f, i) => {
              const [x1, y1] = STATION_COORDS[f.from];
              const [x2, y2] = STATION_COORDS[f.to];
              return (
                <line
                  key={`v${i}`}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="var(--fg)"
                  strokeWidth="0.5"
                  opacity={dimVisible ? 0.15 : 0.4}
                  style={{ transition: 'opacity 0.4s ease' }}
                />
              );
            })}

            {/* Shadow flows */}
            {showShadow && SHADOW_FLOWS.map((f, i) => {
              if (f.from === f.to) return null; // self-loop nicht zeigen mobile
              const [x1, y1] = STATION_COORDS[f.from];
              const [x2, y2] = STATION_COORDS[f.to];
              const cx = (x1 + x2) / 2 + ((i % 3) - 1) * 25;
              const cy = (y1 + y2) / 2 - 18;
              return (
                <path
                  key={`s${i}`}
                  d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
                  stroke="#D4571B"
                  strokeWidth={consolidate ? '1.4' : '1'}
                  strokeDasharray={consolidate ? '0' : '4 3'}
                  fill="none"
                  opacity={0.85}
                  style={{ transition: 'all 0.5s ease' }}
                >
                  {!consolidate && (
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0" to="-14"
                      dur="1.2s" repeatCount="indefinite"
                    />
                  )}
                </path>
              );
            })}

            {/* Stations */}
            {STATIONS.map((s) => {
              const [x, y] = STATION_COORDS[s.id];
              const r = s.isHub ? 11 : 6;
              return (
                <g key={s.id}>
                  <circle
                    cx={x} cy={y} r={r}
                    fill="var(--bg-base)"
                    stroke={s.isHub ? '#D4571B' : 'var(--fg)'}
                    strokeWidth={s.isHub ? '1.5' : '1'}
                  />
                  <text
                    x={x} y={y - r - 4}
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                    fill="var(--fg-muted)"
                    textAnchor="middle"
                    style={{ letterSpacing: '0.05em' }}
                  >
                    {s.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Akt-Indicator */}
          <div
            className="absolute top-3 left-3 font-mono text-[10px] flex items-center gap-2"
            style={{ color: 'var(--fg-muted)', letterSpacing: '0.12em' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#D4571B' }}
            />
            akt {String(act + 1).padStart(2, '0')} / 04
          </div>
        </div>

        {/* Counter-Block */}
        <div className="flex flex-col gap-1 mt-2">
          <div className="flex justify-between font-mono text-[11px]" style={{ color: 'var(--fg-muted)' }}>
            <span>unsichtbare übergaben</span>
            <span style={{ color: '#D4571B' }}>{counters.uebergaben}</span>
          </div>
          <div className="flex justify-between font-mono text-[11px]" style={{ color: 'var(--fg-muted)' }}>
            <span>zeitverlust / woche</span>
            <span style={{ color: '#D4571B' }}>{counters.stunden} h</span>
          </div>
          <div className="flex justify-between font-mono text-[11px]" style={{ color: 'var(--fg-muted)' }}>
            <span>kosten / jahr</span>
            <span style={{ color: '#D4571B' }}>€ {new Intl.NumberFormat('de-DE').format(counters.euro)}</span>
          </div>
        </div>

        <a
          href="#diagnose"
          className="font-mono text-[13px] no-underline pb-2 inline-flex items-center gap-2 mt-4 self-start"
          style={{ color: 'var(--fg)', borderBottom: '1px solid var(--fg)' }}
        >
          <span>↓</span>
          sichtbar machen
        </a>
      </div>

      {/* Anchor-Spacer: 4 Akte, je 60vh hoch — IntersectionObserver triggert state */}
      <div className="mt-12">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            data-act-anchor={i}
            style={{ height: '60vh' }}
            aria-hidden="true"
          />
        ))}
      </div>
    </section>
  );
}
