import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STORIES = [
  {
    industry: 'Metallbau · 38 Mitarbeitende',
    headline: 'Der Auftrag, der dreimal umgeschrieben wurde.',
    findings: [
      { time: '08:14', text: 'Auftrag von Vertrieb in Excel angelegt' },
      { time: '08:47', text: 'Manuell in ERP übertragen — Zahlendreher.', trace: true },
      { time: '11:20', text: 'Werkstatt fragt nach. Korrektur per Telefon.', trace: true },
      { time: '13:55', text: 'Stückliste in CAD neu gepflegt — drittes Mal.', trace: true },
      { time: '16:10', text: 'Kunde fragt nach Lieferdatum. Niemand weiß genau.', trace: true },
    ],
    summary: '8.4 Stunden pro Auftrag · davon 3.7 unsichtbar',
  },
  {
    industry: 'Sanitär · 22 Mitarbeitende',
    headline: 'Die Materialliste, die im Lager nie ankam.',
    findings: [
      { time: '07:30', text: 'Monteur startet Tour mit Materialliste auf Papier' },
      { time: '09:15', text: 'Lagerist: "Welche Liste denn?" Anruf zur Disposition.', trace: true },
      { time: '10:42', text: 'Material teilweise nicht da. Disposition organisiert nach.', trace: true },
      { time: '14:00', text: 'Monteur kehrt für Restmaterial zurück — 45 km.', trace: true },
      { time: '17:20', text: 'Stundenzettel von Hand abends in System eingepflegt.', trace: true },
    ],
    summary: '12.1 Stunden pro Woche · davon 5.8 unsichtbar',
  },
  {
    industry: 'Fertigung · 64 Mitarbeitende',
    headline: 'Die Freigabe, die niemand traut zu erteilen.',
    findings: [
      { time: '09:00', text: 'Angebot über 28 k€ liegt zur Freigabe' },
      { time: '11:30', text: 'GF nicht erreichbar. Mitarbeiter wartet.', trace: true },
      { time: '14:00', text: 'Nachfrage per E-Mail. Keine Antwort.', trace: true },
      { time: '16:45', text: 'Geht spontan zur Tür. GF: "Klar, machen.".', trace: true },
      { time: 'tag 2', text: 'Kunde hat in der Zwischenzeit angefragt — wirkt unprofessionell.', trace: true },
    ],
    summary: '7.5 Stunden pro Woche · davon 4.2 unsichtbar',
  },
];

export default function StoriesSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const storyRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headerLines = headerRef.current?.querySelectorAll('.reveal-line > span');
      if (headerLines?.length) {
        gsap.fromTo(
          headerLines,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.1,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: headerRef.current, start: 'top 65%', once: true },
          }
        );
      }

      storyRefs.current.forEach((story) => {
        if (!story) return;
        const headline = story.querySelectorAll('.reveal-line > span');
        const findings = story.querySelectorAll('[data-finding]');
        const summary = story.querySelector('[data-summary]');

        gsap.fromTo(
          headline,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.0,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: story, start: 'top 70%', once: true },
          }
        );

        gsap.fromTo(
          findings,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.18,
            ease: 'power3.out',
            scrollTrigger: { trigger: story, start: 'top 50%', once: true },
          }
        );

        if (summary) {
          gsap.fromTo(
            summary,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: { trigger: summary, start: 'top 80%', once: true },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="stories"
      ref={sectionRef}
      data-bg="vignette"
      className="relative px-5 md:px-10 pt-32 md:pt-40 pb-32 md:pb-40"
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-24 md:mb-32 text-center" ref={headerRef}>
          <div className="mono-eyebrow inline-flex items-center gap-3" style={{ color: 'var(--fg-muted)' }}>
            <span className="inline-block w-6 h-px" style={{ background: 'var(--fg-muted)' }} />
            03 · drei geschichten
            <span className="inline-block w-6 h-px" style={{ background: 'var(--fg-muted)' }} />
          </div>
          <h2
            className="editorial-display mt-7 mx-auto"
            style={{
              fontSize: 'clamp(32px, 4.4vw, 56px)',
              color: 'var(--fg)',
              maxWidth: '780px',
            }}
          >
            <span className="reveal-line"><span>Drei Betriebe.</span></span>
            <span className="reveal-line"><span>Drei <em>Übeltäter</em>.</span></span>
            <span className="block" style={{ color: 'var(--fg-muted)' }}>Pseudonymisiert. Mathematisch realistisch.</span>
          </h2>
        </div>

        <div className="space-y-32 md:space-y-40">
          {STORIES.map((story, i) => (
            <article
              key={i}
              ref={(el) => (storyRefs.current[i] = el)}
              className="grid md:grid-cols-12 gap-8 md:gap-12"
            >
              <div className="md:col-span-4">
                <div className="font-mono text-[10px] mb-3" style={{ color: '#D4571B', letterSpacing: '0.15em' }}>
                  geschichte {String(i + 1).padStart(2, '0')}
                </div>
                <div className="font-mono text-[12px] mb-6" style={{ color: 'var(--fg-muted)', letterSpacing: '0.04em' }}>
                  {story.industry}
                </div>
                <h3
                  className="editorial-display"
                  style={{ fontSize: 'clamp(24px, 2.6vw, 36px)', color: 'var(--fg)' }}
                >
                  <span className="reveal-line"><span>{story.headline}</span></span>
                </h3>
              </div>

              <div className="md:col-span-8 md:pl-8 md:border-l" style={{ borderColor: 'var(--line)' }}>
                <ol className="space-y-5">
                  {story.findings.map((f, idx) => (
                    <li
                      key={idx}
                      data-finding
                      className="grid grid-cols-[64px_1fr] gap-5 items-baseline"
                    >
                      <span
                        className="font-mono text-[11px]"
                        style={{
                          color: f.trace ? '#D4571B' : 'var(--fg-muted)',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {f.time}
                      </span>
                      <span
                        className="font-mono"
                        style={{
                          fontSize: '14px',
                          lineHeight: 1.55,
                          color: f.trace ? 'var(--fg)' : 'var(--fg-muted)',
                          opacity: f.trace ? 1 : 0.85,
                        }}
                      >
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ol>

                <div
                  data-summary
                  className="mt-10 pt-6 flex items-baseline gap-4"
                  style={{ borderTop: '0.5px solid var(--line)' }}
                >
                  <span className="font-mono text-[10px]" style={{ color: 'var(--fg-muted)', letterSpacing: '0.12em' }}>
                    Σ
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '15px',
                      color: '#D4571B',
                    }}
                  >
                    {story.summary}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
