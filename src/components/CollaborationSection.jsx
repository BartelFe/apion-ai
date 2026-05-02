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
  const headlineRef = useLineReveal('top 72%');

  useEffect(() => {
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray('[data-step]');
      steps.forEach((step, i) => {
        // Row line draws in
        const border = step.querySelector('[data-step-border]');
        if (border) {
          gsap.fromTo(border, { scaleX: 0 }, {
            scaleX: 1,
            duration: 0.7,
            ease: 'power3.out',
            transformOrigin: 'left center',
            scrollTrigger: { trigger: step, start: 'top 84%', once: true },
          });
        }

        // Number fades in
        const num = step.querySelector('[data-step-num]');
        if (num) {
          gsap.fromTo(num, { opacity: 0 }, {
            opacity: 1,
            duration: 0.5,
            delay: 0.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: step, start: 'top 84%', once: true },
          });
        }

        // Title slides up
        const title = step.querySelector('[data-step-title]');
        if (title) {
          gsap.fromTo(title, { y: 20, opacity: 0 }, {
            y: 0, opacity: 1,
            duration: 0.7,
            delay: 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: step, start: 'top 84%', once: true },
          });
        }

        // Body slides in from right
        const body = step.querySelector('[data-step-body]');
        if (body) {
          gsap.fromTo(body, { x: 20, opacity: 0 }, {
            x: 0, opacity: 1,
            duration: 0.8,
            delay: 0.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: step, start: 'top 84%', once: true },
          });
        }
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
      style={{ '--fg': '#0A0A0B', '--fg-muted': '#6E6E70', '--line': 'rgba(10,10,11,0.12)', '--line-strong': 'rgba(10,10,11,0.35)' }}
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

        <div className="mt-20 md:mt-24">
          {STEPS.map((step, i) => (
            <article key={i} data-step className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 md:py-10 relative">
              {/* Animated border line */}
              <div data-step-border className="absolute top-0 left-0 right-0 h-px" style={{ background: 'var(--line)', transformOrigin: 'left center' }} />

              <div data-step-num className="md:col-span-2 font-mono text-[11px]"
                style={{ color: 'var(--fg-muted)', letterSpacing: '0.18em', opacity: 0 }}>
                {step.no}
              </div>

              <div data-step-title className="md:col-span-3" style={{ opacity: 0 }}>
                <div className="editorial-display" style={{ fontSize: 'clamp(24px, 2.4vw, 32px)' }}>
                  {step.title}
                </div>
                <div className="mt-2 font-mono text-[11px] flex flex-col gap-0.5" style={{ color: 'var(--fg-muted)' }}>
                  <span>{step.duration}</span>
                  <span style={{ color: '#D4571B' }}>{step.cost}</span>
                </div>
              </div>

              <div data-step-body className="md:col-span-7" style={{ opacity: 0 }}>
                <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--fg)' }}>
                  {step.body}
                </p>
              </div>
            </article>
          ))}
          {/* Final bottom border */}
          <div className="h-px" style={{ background: 'var(--line)' }} />
        </div>
      </div>
    </section>
  );
}
