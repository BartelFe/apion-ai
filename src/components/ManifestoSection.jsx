import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATEMENTS = [
  {
    eyebrow: '01',
    text: 'Wir glauben nicht an KI als Produkt. Wir glauben an Prozesse, die endlich tragen.',
    dark: false,
  },
  {
    eyebrow: '02',
    text: 'Berater erzählen, was möglich wäre. Wir setzen das ein, was funktioniert.',
    dark: true, // Insel-Vignette mitten in Light-Sektion
  },
  {
    eyebrow: '03',
    text: 'Niemand hat seinen Betrieb gegründet, um Daten zweimal zu pflegen. Also tun wir es nicht.',
    dark: false,
  },
];

export default function ManifestoSection() {
  const sectionRef = useRef(null);
  const stmtRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      stmtRefs.current.forEach((stmt) => {
        if (!stmt) return;
        const text = stmt.querySelector('[data-stmt-text]');
        const eyebrow = stmt.querySelector('[data-stmt-eyebrow]');
        if (text) {
          gsap.fromTo(
            text,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.1,
              ease: 'power3.out',
              scrollTrigger: { trigger: stmt, start: 'top 75%', once: true },
            }
          );
        }
        if (eyebrow) {
          gsap.fromTo(
            eyebrow,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: { trigger: stmt, start: 'top 80%', once: true },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      data-bg="light"
      className="relative px-5 md:px-10 pt-32 md:pt-44 pb-32 md:pb-44"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-20 mono-eyebrow flex items-center gap-3" style={{ color: 'var(--fg-muted)' }}>
          <span className="inline-block w-6 h-px" style={{ background: 'var(--fg-muted)' }} />
          05 · haltung
        </div>

        <div className="space-y-32 md:space-y-40">
          {STATEMENTS.map((s, i) => (
            <div
              key={i}
              ref={(el) => (stmtRefs.current[i] = el)}
              className={s.dark ? 'manifesto-dark relative' : 'relative'}
              style={
                s.dark
                  ? {
                      padding: '60px 40px',
                      background:
                        'radial-gradient(ellipse 90% 80% at 50% 50%, #08070A 0%, #1A1408 100%)',
                      borderRadius: '2px',
                      color: '#F5F3EE',
                    }
                  : {}
              }
            >
              <div
                data-stmt-eyebrow
                className="font-mono text-[11px] mb-7"
                style={{
                  color: s.dark ? '#D4571B' : 'var(--fg-muted)',
                  letterSpacing: '0.18em',
                }}
              >
                — {s.eyebrow}
              </div>
              <p
                data-stmt-text
                className="editorial-display"
                style={{
                  fontSize: 'clamp(24px, 3.2vw, 44px)',
                  lineHeight: 1.25,
                  color: s.dark ? '#F5F3EE' : 'var(--fg)',
                }}
              >
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
