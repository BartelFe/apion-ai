import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLineReveal } from '../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const PHASES = [
  {
    no: '01',
    title: 'Identifizieren',
    sub: 'Wo verlieren wir Zeit, Geld, Umsatz?',
    body: 'Wir analysieren keine Theorien, wir analysieren Ihre Praxis. Zwei Wochen mit Ihrem Team, in Ihren Tools, an Ihren Übergaben. Ergebnis: ein priorisiertes Bild des unsichtbaren Betriebs — und ein klarer Pilot-Kandidat.',
    output: '→ Diagnose-Bericht · Pilotvorschlag',
  },
  {
    no: '02',
    title: 'Automatisieren',
    sub: 'Bestehende Systeme integrieren.',
    body: 'Keine neuen Tools, wenn die alten reichen. Wir verbinden, was bereits da ist, und ergänzen punktuell wo nötig. Priorität: Wiederverwendbarkeit, nicht Glanz. Was wir bauen, soll Ihr Team ohne uns weiterführen können.',
    output: '→ Live-Workflow · Doku · Schulung',
  },
  {
    no: '03',
    title: 'Messen',
    sub: 'Die wichtigen Kennzahlen im Blick.',
    body: 'Was wir nicht messen, können wir nicht verbessern. Wir definieren mit Ihnen drei bis fünf Kennzahlen, die wirklich zählen — und stellen sie so dar, dass eine Geschäftsführung in 30 Sekunden sieht, ob etwas läuft oder nicht.',
    output: '→ Dashboard · monatliche Lesung',
  },
  {
    no: '04',
    title: 'Skalieren',
    sub: 'Nur dort ausrollen, wo der Impact da ist.',
    body: 'Wir rollen nicht aus, weil wir können. Wir rollen aus, wenn die Zahlen es rechtfertigen. Erst der zweite Use Case, dann der dritte. Schritt für Schritt — kein Big-Bang, keine Schock-Modernisierung.',
    output: '→ Roadmap · Use-Case-2 · 3 · n',
  },
];

export default function MethodSection() {
  const sectionRef = useRef(null);
  const headlineRef = useLineReveal();
  const trackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Phasen-Karten staffeln beim Reinscrollen
      gsap.utils.toArray('[data-phase]').forEach((phase, i) => {
        gsap.fromTo(
          phase,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: phase, start: 'top 80%', once: true },
          }
        );
      });

      // Verbindungslinie progressiv zeichnen
      const line = trackRef.current?.querySelector('[data-track-line]');
      if (line) {
        gsap.fromTo(
          line,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: trackRef.current,
              start: 'top 70%',
              end: 'bottom 60%',
              scrub: 0.6,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="methode"
      ref={sectionRef}
      data-bg="light"
      className="relative px-5 md:px-10 pt-32 md:pt-40 pb-32 md:pb-40"
    >
      <div className="max-w-6xl mx-auto" ref={headlineRef}>
        <div className="mono-eyebrow flex items-center gap-3" style={{ color: 'var(--fg-muted)' }}>
          <span className="inline-block w-6 h-px" style={{ background: 'var(--fg-muted)' }} />
          04 · vorgehen
        </div>
        <h2
          className="editorial-display mt-7"
          style={{ fontSize: 'clamp(32px, 4.4vw, 60px)', maxWidth: '820px' }}
        >
          <span className="reveal-line"><span>Vier Phasen.</span></span>
          <span className="reveal-line"><span>Keine davon ist verhandelbar.</span></span>
          <span className="reveal-line"><span style={{ color: 'var(--fg-muted)' }}>Keine davon ist Berater-Folklore.</span></span>
        </h2>

        <div ref={trackRef} className="mt-20 md:mt-24 relative">
          {/* Verbindungslinie */}
          <div
            data-track-line
            className="absolute top-[28px] left-0 right-0 h-px hidden md:block"
            style={{ background: 'var(--line-strong)' }}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
            {PHASES.map((phase, i) => (
              <div key={i} data-phase className="relative">
                {/* Knoten */}
                <div className="hidden md:block absolute top-[22px] left-0 w-3 h-3 rounded-full"
                  style={{
                    background: 'var(--fg)',
                    boxShadow: '0 0 0 4px var(--bg-base, #F5F3EE)',
                  }}
                />
                <div className="md:pl-8">
                  <div className="font-mono text-[10px] mb-3" style={{ color: 'var(--fg-muted)', letterSpacing: '0.18em' }}>
                    {phase.no} · phase
                  </div>
                  <div
                    className="editorial-display mb-2"
                    style={{ fontSize: 'clamp(28px, 2.6vw, 36px)' }}
                  >
                    {phase.title}
                  </div>
                  <div
                    className="font-mono italic mb-5"
                    style={{ fontSize: '13px', color: 'var(--fg-muted)' }}
                  >
                    {phase.sub}
                  </div>
                  <p style={{ fontSize: '14px', lineHeight: 1.65, color: 'var(--fg)' }}>
                    {phase.body}
                  </p>
                  <div
                    className="mt-6 pt-4 font-mono text-[11px]"
                    style={{ borderTop: '0.5px solid var(--line)', color: '#D4571B', letterSpacing: '0.04em' }}
                  >
                    {phase.output}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
