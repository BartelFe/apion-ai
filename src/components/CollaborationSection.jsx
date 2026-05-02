import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLineReveal } from '../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    no: '01',
    title: 'Erstgespräch',
    duration: '30 minuten',
    cost: 'kostenlos',
    body: 'Wir hören zu. Sie beschreiben, was hakt. Wir sortieren, ob eine Zusammenarbeit überhaupt sinnvoll ist — und sagen es Ihnen ehrlich, auch wenn die Antwort "nein" ist.',
  },
  {
    no: '02',
    title: 'Diagnose',
    duration: '2 — 3 wochen',
    cost: 'fester preis',
    body: 'Strukturierte Prozessanalyse mit klar definiertem Ziel. Sie bekommen am Ende einen Bericht, den Sie auch ohne uns weiterverwenden können — und einen Pilotvorschlag, der sich rechnet.',
  },
  {
    no: '03',
    title: 'Pilot',
    duration: '4 — 8 wochen',
    cost: 'fester preis',
    body: 'Ein Use Case wird umgesetzt, gemessen, dokumentiert. Erst danach entscheiden wir gemeinsam, ob es weitergeht. Kein Vendor-Lock, keine versteckten Verpflichtungen.',
  },
  {
    no: '04',
    title: 'Skalierung',
    duration: 'optional',
    cost: 'nach impact',
    body: 'Nur dann, wenn der Pilot trägt. Schritt für Schritt weitere Use Cases. Sie behalten jederzeit die Kontrolle über Tempo und Tiefe.',
  },
];

export default function CollaborationSection() {
  const sectionRef = useRef(null);
  const headlineRef = useLineReveal();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-step]').forEach((step) => {
        gsap.fromTo(
          step,
          { x: -20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: step, start: 'top 82%', once: true },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="leistungen"
      ref={sectionRef}
      data-bg="light"
      className="relative px-5 md:px-10 pt-32 md:pt-40 pb-32 md:pb-40"
    >
      <div className="max-w-5xl mx-auto" ref={headlineRef}>
        <div className="mono-eyebrow flex items-center gap-3" style={{ color: 'var(--fg-muted)' }}>
          <span className="inline-block w-6 h-px" style={{ background: 'var(--fg-muted)' }} />
          06 · zusammenarbeit
        </div>
        <h2
          className="editorial-display mt-7"
          style={{ fontSize: 'clamp(32px, 4.4vw, 60px)', maxWidth: '780px' }}
        >
          <span className="reveal-line"><span>Klarer Einstieg.</span></span>
          <span className="reveal-line"><span>Klarer Ausstieg.</span></span>
          <span className="reveal-line"><span style={{ color: 'var(--fg-muted)' }}>Dazwischen: messbare Wirkung.</span></span>
        </h2>

        <div className="mt-20 md:mt-24 space-y-1">
          {STEPS.map((step, i) => (
            <article
              key={i}
              data-step
              className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 md:py-10"
              style={{ borderTop: '0.5px solid var(--line)' }}
            >
              <div className="md:col-span-2 font-mono text-[11px]"
                style={{ color: 'var(--fg-muted)', letterSpacing: '0.18em' }}>
                {step.no}
              </div>

              <div className="md:col-span-3">
                <div
                  className="editorial-display"
                  style={{ fontSize: 'clamp(24px, 2.4vw, 32px)' }}
                >
                  {step.title}
                </div>
                <div className="mt-2 font-mono text-[11px] flex flex-col gap-0.5"
                  style={{ color: 'var(--fg-muted)' }}>
                  <span>{step.duration}</span>
                  <span style={{ color: '#D4571B' }}>{step.cost}</span>
                </div>
              </div>

              <div className="md:col-span-7">
                <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--fg)' }}>
                  {step.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
