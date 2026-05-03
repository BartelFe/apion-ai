import { useEffect, useRef, useState } from 'react';
import HeroScene from './Hero/HeroScene';
import HeroMobile from './Hero/fallback/HeroMobile';
import Headline from './Hero/hud/Headline';
import DataHUD from './Hero/hud/DataHUD';
import { createHeroChoreography } from './Hero/ScrollChoreography';

// Root-Hero-Komponente.
// Desktop: 3D-Welt mit pin/scrub-basierter 4-Akt-Choreografie.
// Mobile (<768px): 2D-SVG-Fallback mit IntersectionObserver-Akten.

export default function Hero() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768
  );

  // Mobile-Detection inkl. Resize.
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

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
        {/* 3D-Szene Vollbild im Hintergrund */}
        <div className="absolute inset-0">
          <HeroScene ref={sceneRef} />
        </div>

        {/* Sketch-Vignette für Editorial-Look */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 100% 80% at 50% 50%, transparent 50%, rgba(229,225,216,0.5) 100%)',
          }}
        />

        {/* Bracket-Frame */}
        <div
          className="bracket-frame absolute pointer-events-none"
          style={{
            top: '40px', left: '24px', right: '24px', bottom: '40px',
            color: 'var(--fg)',
          }}
        >
          <span className="bk-bl" /><span className="bk-br" />
        </div>

        {/* Headline left */}
        <Headline ref={headlineRef} />

        {/* HUD right */}
        <DataHUD ref={hudRef} />

        {/* Akt-Indicator */}
        <div
          className="absolute z-20 left-5 bottom-12 md:left-10 md:bottom-16 font-mono text-[10px] pointer-events-none"
          style={{ color: 'var(--fg-muted)', letterSpacing: '0.18em' }}
        >
          scroll · vier akte · 09:14 → 17:00
        </div>

        {/* Scroll-Hint */}
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
