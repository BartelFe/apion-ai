import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
const founderImg = '/founder.jpg';

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
    dark: true,
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
        const line = stmt.querySelector('[data-stmt-line]');
        const photo = stmt.querySelector('[data-stmt-photo]');
        const attribution = stmt.querySelector('[data-stmt-attribution]');

        if (line) {
          gsap.fromTo(line, { scaleX: 0 }, {
            scaleX: 1,
            duration: 0.9,
            ease: 'power3.out',
            transformOrigin: 'left center',
            scrollTrigger: { trigger: stmt, start: 'top 78%', once: true },
          });
        }

        if (eyebrow) {
          gsap.fromTo(eyebrow, { opacity: 0, x: -12 }, {
            opacity: 1, x: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: stmt, start: 'top 78%', once: true },
          });
        }

        if (photo) {
          gsap.fromTo(photo, { opacity: 0, scale: 1.04 }, {
            opacity: 1, scale: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: stmt, start: 'top 72%', once: true },
          });
        }

        if (attribution) {
          gsap.fromTo(attribution, { opacity: 0, y: 12 }, {
            opacity: 1, y: 0,
            duration: 0.7,
            delay: 0.4,
            ease: 'power2.out',
            scrollTrigger: { trigger: stmt, start: 'top 72%', once: true },
          });
        }

        if (text) {
          const words = text.textContent.split(' ');
          text.innerHTML = words
            .map((w) => `<span class="manifesto-word" style="display:inline-block;overflow:hidden;vertical-align:bottom;padding-right:0.25em"><span style="display:inline-block">${w}</span></span>`)
            .join('');

          gsap.fromTo(
            text.querySelectorAll('.manifesto-word > span'),
            { yPercent: 105, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.75,
              stagger: { each: 0.04, from: 'start' },
              ease: 'power3.out',
              scrollTrigger: { trigger: stmt, start: 'top 75%', once: true },
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
      style={{ '--fg': '#0A0A0B', '--fg-muted': '#6E6E70', '--line': 'rgba(10,10,11,0.12)', '--line-strong': 'rgba(10,10,11,0.35)' }}
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
              className="relative"
            >
              {s.dark ? (
                /* Dark panel — photo left, text right */
                <div
                  style={{
                    borderRadius: '2px',
                    overflow: 'hidden',
                    background: 'radial-gradient(ellipse 90% 80% at 50% 50%, #08070A 0%, #1A1408 100%)',
                  }}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Founder photo */}
                    <div
                      data-stmt-photo
                      className="founder-photo-wrap md:w-5/12 flex-shrink-0"
                      style={{ opacity: 0 }}
                    >
                      <img
                        src={founderImg}
                        alt="Felix Bartel, Gründer APION"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center 18%',
                          display: 'block',
                        }}
                      />
                    </div>

                    {/* Text column */}
                    <div className="flex flex-col justify-center px-8 py-12 md:px-12 md:py-16 md:w-7/12">
                      <div
                        data-stmt-eyebrow
                        className="font-mono text-[11px] mb-7"
                        style={{ color: '#D4571B', letterSpacing: '0.18em', opacity: 0 }}
                      >
                        — {s.eyebrow}
                      </div>
                      <p
                        data-stmt-text
                        className="editorial-display"
                        style={{
                          fontSize: 'clamp(22px, 2.8vw, 38px)',
                          lineHeight: 1.25,
                          color: '#F5F3EE',
                        }}
                      >
                        {s.text}
                      </p>
                      {/* Founder attribution */}
                      <div
                        data-stmt-attribution
                        className="mt-10 pt-6 flex items-center gap-4"
                        style={{ borderTop: '0.5px solid rgba(245,243,238,0.18)', opacity: 0 }}
                      >
                        <div>
                          <div className="font-mono text-[12px]" style={{ color: '#F5F3EE', letterSpacing: '0.04em' }}>
                            Felix Bartel
                          </div>
                          <div className="font-mono text-[11px] mt-1" style={{ color: '#8B847A', letterSpacing: '0.08em' }}>
                            Gründer · APION
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Light statement */
                <>
                  <div
                    data-stmt-line
                    className="mb-7 h-px"
                    style={{ background: 'var(--line-strong)', transformOrigin: 'left center' }}
                  />
                  <div
                    data-stmt-eyebrow
                    className="font-mono text-[11px] mb-7"
                    style={{ color: 'var(--fg-muted)', letterSpacing: '0.18em', opacity: 0 }}
                  >
                    — {s.eyebrow}
                  </div>
                  <p
                    data-stmt-text
                    className="editorial-display"
                    style={{
                      fontSize: 'clamp(24px, 3.2vw, 44px)',
                      lineHeight: 1.25,
                      color: 'var(--fg)',
                    }}
                  >
                    {s.text}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
