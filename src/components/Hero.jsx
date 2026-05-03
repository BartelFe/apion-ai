import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import HeroDiagram from './3d/HeroDiagram';

export default function Hero() {
  const containerRef = useRef(null);
  const [active, setActive] = useState(false);
  const [counters, setCounters] = useState({ visible: 0, hidden: 0 });

  useEffect(() => {
    let ctx;
    let cancelled = false;

    document.fonts.ready.then(() => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        gsap.set('#hero-data', { opacity: 0 });
        gsap.set('#hero-cta', { opacity: 0 });
        gsap.set(['#hero-canvas-meta', '#hero-canvas-legend'], { opacity: 0 });
        gsap.set('#hero-scroll', { opacity: 0 });
        // y:0 clears the pixel-y GSAP reads from CSS translateY(110%)
        gsap.set('#hero-headline .reveal-line > span', { y: 0, yPercent: 110 });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.to(
          '#hero-headline .reveal-line > span',
          { yPercent: 0, duration: 1.2, stagger: 0.14 },
          0.45,
        );
        tl.to(['#hero-canvas-meta', '#hero-canvas-legend'], { opacity: 1, duration: 0.7, stagger: 0.1 }, 1.1);
        tl.to('#hero-data', { opacity: 1, duration: 0.8 }, 1.6);
        tl.to('#hero-cta', { opacity: 1, duration: 0.7 }, 1.9);
        tl.to('#hero-scroll', { opacity: 1, duration: 0.6 }, 2.3);

        const animateCount = (key, target) => {
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 1.6,
            delay: 1.8,
            ease: 'power2.out',
            onUpdate: () => setCounters((c) => ({ ...c, [key]: Math.round(obj.v) })),
          });
        };
        animateCount('visible', 124);
        animateCount('hidden', 47);
      });

      setActive(true);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      data-bg="light"
      className="relative min-h-screen px-5 md:px-10 pt-20 md:pt-32 pb-20"
    >
      <div className="bracket-frame absolute" style={{
        top: '80px', left: '24px', right: '24px', bottom: '60px',
        color: 'var(--fg)',
        pointerEvents: 'none',
      }}>
        <span className="bk-bl" /><span className="bk-br" />
      </div>

      {/* hero-grid-height applies calc(100vh-220px) only on md+ */}
      <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-14 z-10 hero-grid-height">

        {/* Left column — on mobile: stacks naturally so CTA is in viewport */}
        <div className="md:col-span-5 flex flex-col md:justify-between pt-4 md:pt-8 pl-2 md:pl-8">
          <div>
            <h1 id="hero-headline"
              className="editorial-display mt-5 md:mt-8"
              style={{ fontSize: 'clamp(32px, 4.2vw, 62px)' }}>
              <span className="reveal-line"><span>Jeder Mittelstandsbetrieb</span></span>
              <span className="reveal-line"><span>hat zwei Betriebe.</span></span>
              <span className="reveal-line">
                <span style={{ color: 'var(--fg-muted)', fontStyle: 'italic' }}>Den sichtbaren —</span>
              </span>
              <span className="reveal-line">
                <span>und den, der ihn <em>auffrisst</em>.</span>
              </span>
            </h1>

            <div id="hero-data" className="mt-6 md:mt-10 flex items-end gap-8" style={{ opacity: 0 }}>
              <DataBlock label="Sichtbare Verbindungen" value={counters.visible} unit="aktiv" />
              <DataBlock label="Unsichtbare Übergaben" value={counters.hidden} unit="erkannt" trace />
            </div>
          </div>

          {/* CTA: mt-6 on mobile (natural flow), md:mt-auto pushes it down on desktop */}
          <div id="hero-cta" className="flex items-center gap-6 mt-6 md:mt-auto pb-4" style={{ opacity: 0 }}>
            <a href="#diagnose" className="font-mono text-[13px] no-underline pb-3.5 inline-flex items-center gap-2.5 group transition-all"
              style={{ color: 'var(--fg)', borderBottom: '1px solid var(--fg)' }}>
              <span className="transition-transform group-hover:translate-x-1">↓</span>
              sichtbar machen
            </a>
            <span className="font-mono text-[11px]" style={{ color: 'var(--fg-muted)', letterSpacing: '0.05em' }}>
              30 minuten · unverbindlich
            </span>
          </div>
        </div>

        {/* Canvas column — hero-canvas class controls height responsively */}
        <div className="md:col-span-7 hero-canvas relative"
          style={{
            border: '0.5px solid var(--line)',
            background: 'linear-gradient(180deg, rgba(245,243,238,0.4), rgba(229,225,216,0.5))',
          }}>
          <div id="hero-canvas-meta" className="absolute top-4 left-4 font-mono text-[10px] flex items-center gap-2 z-10"
            style={{ color: 'var(--fg-muted)', letterSpacing: '0.1em', opacity: 0 }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{
              background: '#D4571B', animation: 'pulse 2s ease-in-out infinite',
            }} />
            <span>betrieb #demo · 09:00 → 17:00 · 32 stationen</span>
          </div>

          <div className="w-full h-full" style={{ minHeight: 'inherit' }}>
            <HeroDiagram active={active} />
          </div>

          <div id="hero-canvas-legend" className="absolute bottom-4 left-4 flex gap-5 font-mono text-[10px]"
            style={{ color: 'var(--fg-muted)', letterSpacing: '0.05em', opacity: 0 }}>
            <Legend type="ink" label="station" />
            <Legend type="line" label="übergabe" />
            <Legend type="trace" label="unsichtbar" />
          </div>
        </div>
      </div>

      <div id="hero-scroll" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-5 pointer-events-none"
        style={{ bottom: '80px', color: 'var(--fg-muted)', opacity: 0 }}>
        <span className="font-mono text-[10px]" style={{ letterSpacing: '0.18em' }}>scroll</span>
        <span className="block w-px h-8 relative overflow-hidden" style={{ background: 'currentColor' }}>
          <span className="absolute left-0 w-full h-1/2"
            style={{
              background: 'linear-gradient(180deg, transparent, var(--fg))',
              animation: 'scrollHint 2.4s ease-in-out infinite',
            }} />
        </span>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes scrollHint {
          0% { top: -50%; } 100% { top: 100%; }
        }
      `}</style>
    </section>
  );
}

function DataBlock({ label, value, unit, trace = false }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[10px]"
        style={{
          color: trace ? '#D4571B' : 'var(--fg-muted)',
          letterSpacing: '0.12em',
        }}>
        {label}
      </span>
      <span className="editorial-display flex items-baseline gap-1.5"
        style={{
          fontSize: 'clamp(28px, 3vw, 38px)',
          color: trace ? '#D4571B' : 'var(--fg)',
        }}>
        {value}
        <span className="font-mono text-[12px]" style={{ color: 'var(--fg-muted)', letterSpacing: '0.05em' }}>
          {unit}
        </span>
      </span>
    </div>
  );
}

function Legend({ type, label }) {
  const swatch = {
    ink: <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--fg)' }} />,
    line: <span className="w-3 h-px" style={{ background: 'var(--fg)', opacity: 0.4 }} />,
    trace: <span className="w-3" style={{ height: '1.5px', background: '#D4571B' }} />,
  }[type];
  return (
    <span className="inline-flex items-center gap-2">{swatch}{label}</span>
  );
}
