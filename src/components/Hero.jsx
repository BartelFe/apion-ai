import { useEffect, useRef } from 'react';
import HeroScene from './Hero/HeroScene';
import HeroMobile from './Hero/fallback/HeroMobile';
import Headline from './Hero/hud/Headline';
import DataHUD from './Hero/hud/DataHUD';
import { createHeroChoreography } from './Hero/ScrollChoreography';
import { useMediaQuery } from '../hooks/useMediaQuery';

// Root-Hero-Komponente.
// Desktop: 3D-Welt mit pin/scrub-basierter 4-Akt-Choreografie.
// Mobile (<768px): 2D-SVG-Fallback mit IntersectionObserver-Akten.

export default function Hero() {
  // Desktop-Layout (50/50-Grid mit echter 3D-Welt) ab 768px (Tailwind md:).
  // Darunter: 2D-SVG-Fallback mit Stack-Layout.
  const isMobile = useMediaQuery('(max-width: 767px)');
  if (isMobile) return <HeroMobile />;
  return <HeroDesktop />;
}

function HeroDesktop() {
  const sectionRef  = useRef(null);
  const stickyRef   = useRef(null);
  const sceneRef    = useRef(null);
  const headlineRef = useRef(null);
  const hudRef      = useRef(null);

  useEffect(() => {
    // Reduced-Motion: 4-Akt-Scrub komplett überspringen, statt dessen
    // einen ruhigen Final-State zeigen — keine Pin/Scrub-Trigger.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const w = sceneRef.current?.world();
      if (w) {
        w.setVisibleLayerOpacity(0.6);
        w.setShadowProgress(1);
        w.setShadowOpacity(0.85);
        w.setShadowIntensity(0.7);
        w.setNamedProgress(1);
      }
      const h = hudRef.current;
      if (h) {
        h.setVisible(124);
        h.setUebergaben(47);
        h.setStunden('15.6');
        h.setEuro(33800);
        h.setEinsparung(23660);
      }
      return;
    }

    const tl = createHeroChoreography({
      section: sectionRef.current,
      sticky: stickyRef.current,
      world: () => sceneRef.current?.world(),
      hud: () => hudRef.current,
      headline: () => headlineRef.current,
    });

    return () => {
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      data-bg="light"
      className="relative"
    >
      {/* Section bleibt natürlich = 100vh; GSAP pin fügt das 400vh-Spacing automatisch hinzu */}
      <div
        ref={stickyRef}
        className="relative h-screen w-full overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, var(--bg-base) 0%, rgba(245,243,238,0.95) 100%)',
        }}
      >
        {/*
          GRID-LAYOUT (Desktop ≥1024px):
          ─ Linke Spalte (0 → 50vw - 24px Padding): Headline + Section-Label + Bottom-Indikator
          ─ Rechte Spalte (50vw → 100vw):           3D-Szene + DataHUD + AuftragsTag

          Beide Spalten sind absolute Boxen, damit der Sketch-Frame und Vignette
          full-bleed bleiben können — und damit "auffrisst" über die Spalten-Grenze
          in die 3D-Welt greifen darf.
        */}

        {/* MITTE: 3D-Szene — sitzt zwischen Headline und DataHUD, darf
            beide Seiten leicht überlappen damit das Canvas Atemraum hat
            und die Stationen nicht clippen. Headline-Spalte ist
            pointer-events-none, HUD-Inhalte halten sich rechts/Mitte ihrer
            Spalte → optisches Overlap, kein Click-Konflikt. */}
        <div
          className="absolute top-0 bottom-0"
          style={{ left: '40vw', right: 'clamp(180px, 15vw, 280px)' }}
        >
          <div className="absolute inset-0">
            <HeroScene ref={sceneRef} />
          </div>
        </div>

        {/* RECHTS: DataHUD-Spalte — eigene Zone, das Canvas darf optisch
            in die linken ~50px dieser Spalte hineinragen (leerer
            Canvas-Rand, keine 3D-Geometrie). */}
        <div
          className="absolute right-0 top-0 bottom-0"
          style={{ width: 'clamp(240px, 21vw, 380px)' }}
        >
          <DataHUD ref={hudRef} />
        </div>

        {/* Sketch-Vignette — full-bleed, Atmosphäre über beiden Spalten */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 100% 80% at 50% 50%, transparent 50%, rgba(229,225,216,0.5) 100%)',
          }}
        />

        {/* Bracket-Frame full-bleed */}
        <div
          className="bracket-frame absolute pointer-events-none"
          style={{
            top: '40px', left: '24px', right: '24px', bottom: '40px',
            color: 'var(--fg)',
          }}
        >
          <span className="bk-bl" /><span className="bk-br" />
        </div>

        {/* LINKE SPALTE: Headline + Section-Label + Bottom-Indikator (0 → 50vw) */}
        <div
          className="absolute left-0 top-0 bottom-0 pointer-events-none"
          style={{ width: '50vw' }}
        >
          <Headline ref={headlineRef} />

          {/* Akt-Indicator unten links innerhalb der linken Spalte */}
          <div
            className="absolute z-20 left-10 bottom-16 font-mono text-[10px]"
            style={{ color: 'var(--fg-muted)', letterSpacing: '0.18em' }}
          >
            scroll · vier akte · 09:14 → 17:00
          </div>
        </div>

        {/* Scroll-Hint mittig zwischen den Spalten */}
        <div
          className="absolute z-20 left-1/2 bottom-8 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          style={{ color: 'var(--fg-muted)' }}
        >
          <span className="font-mono text-[10px]" style={{ letterSpacing: '0.18em' }}>scroll</span>
          <span className="block w-px h-7 relative overflow-hidden" style={{ background: 'currentColor' }}>
            <span
              className="absolute left-0 w-full h-1/2"
              style={{
                background: 'linear-gradient(180deg, transparent, var(--fg))',
                animation: 'scrollHint 2.4s ease-in-out infinite',
              }}
            />
          </span>
        </div>
      </div>

      <style>{`
        @keyframes scrollHint {
          0% { top: -50%; } 100% { top: 100%; }
        }
      `}</style>
    </section>
  );
}
