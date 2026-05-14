import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

// Editorial-Typo links über der Szene.
// Das Wort "auffrisst" wird in Akt 2 orange — synchron zum Shadow-Bloom.
const Headline = forwardRef(function Headline(_, ref) {
  const rootRef    = useRef();
  const auffrisstRef = useRef();

  useEffect(() => {
    // Initial: alle Linien aus dem Clip-Container raus
    const lines = rootRef.current?.querySelectorAll('.reveal-line > span');
    if (!lines?.length) return;
    gsap.set(lines, { y: 0, yPercent: 110 });

    document.fonts.ready.then(() => {
      gsap.to(lines, {
        yPercent: 0,
        duration: 1.1,
        stagger: 0.13,
        ease: 'power3.out',
        delay: 0.3,
      });
    });
  }, []);

  useImperativeHandle(ref, () => ({
    triggerBloom() {
      // Wort wird orange + leicht gepulst
      gsap.to(auffrisstRef.current, {
        color: '#D4571B',
        duration: 0.4,
        ease: 'power2.out',
      });
      gsap.fromTo(
        auffrisstRef.current,
        { textShadow: '0 0 0 rgba(212,87,27,0)' },
        { textShadow: '0 0 24px rgba(212,87,27,0.6)', duration: 0.5, yoyo: true, repeat: 1 }
      );
    },
  }));

  return (
    <div
      ref={rootRef}
      className="absolute z-20 left-10 pointer-events-none"
      // Hartes Limit: H1 darf nie in die rechte Spalte (3D-Welt) bluten.
      // 24px Buffer zur Spalten-Grenze.
      // Top-Position skaliert mit Viewport-Höhe — auf 1440h+ rückt die
      // Headline mittiger statt oben-links anchored zu wirken.
      style={{
        maxWidth: 'calc(50vw - 64px)',
        top: 'clamp(7rem, 16vh, 240px)',
      }}
    >
      <div className="mono-eyebrow mb-6" style={{ color: 'var(--fg-muted)' }}>
        00 · der unsichtbare betrieb
      </div>
      <h1
        className="editorial-display"
        style={{
          fontSize: 'clamp(28px, 3.6vw, 96px)',
          lineHeight: 1.05,
          // Container respektiert maxWidth, aber overflow:visible erlaubt
          // dem Bleed-Wort die Spalten-Grenze zu überschreiten.
          overflow: 'visible',
        }}
      >
        <span className="reveal-line"><span>Jeder Mittelstandsbetrieb</span></span>
        <span className="reveal-line"><span>hat zwei Betriebe.</span></span>
        <span className="reveal-line">
          <span style={{ color: 'var(--fg-muted)', fontStyle: 'italic' }}>Den sichtbaren —</span>
        </span>
        {/*
          Bleed-Zeile: white-space: nowrap (via .reveal-line--bleed > span),
          damit "auffrisst" auf derselben Zeile bleibt und horizontal
          aus der linken Spalte herauswächst — synchron zum Bloom in Akt 2.
        */}
        <span className="reveal-line reveal-line--bleed">
          <span>
            und den, der ihn{' '}
            <em ref={auffrisstRef} style={{ fontStyle: 'italic' }}>auffrisst</em>.
          </span>
        </span>
      </h1>
    </div>
  );
});

export default Headline;
