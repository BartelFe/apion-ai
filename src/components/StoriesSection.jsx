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
  const trackRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header line reveal
      const headerLines = headerRef.current?.querySelectorAll('.reveal-line > span');
      if (headerLines?.length) {
        gsap.fromTo(headerLines, { y: 0, yPercent: 110 }, {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 65%', once: true },
        });
      }

      // Scroll-hint fades in with header
      gsap.fromTo('[data-stories-hint]', { opacity: 0, x: -8 }, {
        opacity: 1, x: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 60%', once: true },
      });
    }, sectionRef);

    // IntersectionObserver for card entrance (works for horizontal visibility)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(entry.target, {
              opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    cardRefs.current.forEach((card) => {
      if (!card) return;
      gsap.set(card, { opacity: 0, x: 32 });
      observer.observe(card);
    });

    // Drag-to-scroll on desktop
    const track = trackRef.current;
    if (!track) {
      return () => { ctx.revert(); observer.disconnect(); };
    }

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onDown = (e) => {
      isDown = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      track.style.userSelect = 'none';
    };
    const onLeave = () => { isDown = false; track.style.userSelect = ''; };
    const onUp = () => { isDown = false; track.style.userSelect = ''; };
    const onMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 1.4;
    };

    track.addEventListener('mousedown', onDown);
    track.addEventListener('mouseleave', onLeave);
    track.addEventListener('mouseup', onUp);
    track.addEventListener('mousemove', onMove, { passive: false });

    // Tastatur-Nav — ArrowLeft/Right scrollt um eine Karten-Breite (~600px)
    const onKey = (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const delta = e.key === 'ArrowRight' ? 600 : -600;
      track.scrollBy({ left: delta, behavior: 'smooth' });
    };
    track.addEventListener('keydown', onKey);

    return () => {
      ctx.revert();
      observer.disconnect();
      track.removeEventListener('mousedown', onDown);
      track.removeEventListener('mouseleave', onLeave);
      track.removeEventListener('mouseup', onUp);
      track.removeEventListener('mousemove', onMove);
      track.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <section
      id="stories"
      ref={sectionRef}
      data-bg="vignette"
      style={{
        background: 'radial-gradient(ellipse 90% 70% at 50% 50%, #08070A 0%, #1A1408 100%)',
        '--fg': '#F5F3EE',
        '--fg-muted': '#8B847A',
        '--line': 'rgba(245, 243, 238, 0.14)',
        '--line-strong': 'rgba(245, 243, 238, 0.32)',
      }}
    >
      {/* Section header */}
      <div ref={headerRef} className="px-5 md:px-10 pt-32 md:pt-40 pb-12 md:pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="mono-eyebrow" style={{ color: 'var(--fg-muted)' }}>
            03 · drei geschichten
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
            <span className="block mt-3" style={{ fontSize: 'clamp(15px, 1.6vw, 20px)', color: 'var(--fg-muted)', fontFamily: 'inherit', fontWeight: 300 }}>
              Pseudonymisiert. Mathematisch realistisch.
            </span>
          </h2>

          {/* Scroll / drag hint */}
          <div
            data-stories-hint
            className="mt-8 flex items-center gap-2 font-mono text-[11px]"
            style={{ color: 'var(--fg-muted)', opacity: 0, letterSpacing: '0.1em' }}
          >
            <span>ziehen oder scrollen</span>
            <span style={{ display: 'inline-block', animation: 'hintSlide 1.8s ease-in-out infinite' }}>→</span>
          </div>
        </div>
      </div>

      {/* Horizontal scroll track — tabIndex=0 + ArrowKey-Nav für a11y */}
      <div
        ref={trackRef}
        className="stories-track"
        tabIndex={0}
        role="region"
        aria-label="Geschichten — horizontal scrollbar, mit Pfeiltasten navigieren"
        style={{
          gap: '12px',
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingBottom: '72px',
        }}
      >
        {STORIES.map((story, i) => (
          <article
            key={i}
            ref={(el) => (cardRefs.current[i] = el)}
            tabIndex={0}
            style={{
              flex: '0 0 min(580px, calc(100vw - 52px))',
              scrollSnapAlign: 'start',
              background: 'rgba(245, 243, 238, 0.04)',
              border: '0.5px solid var(--line-strong)',
              borderRadius: '2px',
              padding: '28px 28px 32px',
            }}
          >
            {/* Card header */}
            <div className="flex items-start justify-between mb-2">
              <span className="font-mono text-[10px]" style={{ color: '#D4571B', letterSpacing: '0.15em' }}>
                geschichte {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="font-mono text-[11px] mb-6" style={{ color: 'var(--fg-muted)', letterSpacing: '0.04em' }}>
              {story.industry}
            </div>

            <h3
              className="editorial-display mb-7"
              style={{ fontSize: 'clamp(20px, 2.2vw, 28px)', color: 'var(--fg)', lineHeight: 1.2 }}
            >
              {story.headline}
            </h3>

            <div className="mb-6 h-px" style={{ background: 'var(--line)' }} />

            {/* Findings timeline */}
            <ol className="space-y-4">
              {story.findings.map((f, idx) => (
                <li key={idx} className="grid items-baseline" style={{ gridTemplateColumns: '52px 1fr', gap: '16px' }}>
                  <span
                    className="font-mono text-[11px]"
                    style={{ color: f.trace ? '#D4571B' : 'var(--fg-muted)', letterSpacing: '0.05em' }}
                  >
                    {f.time}
                  </span>
                  <span
                    className="font-mono"
                    style={{ fontSize: '13px', lineHeight: 1.55, color: f.trace ? 'var(--fg)' : 'var(--fg-muted)' }}
                  >
                    {f.text}
                  </span>
                </li>
              ))}
            </ol>

            {/* Summary */}
            <div
              className="mt-8 pt-5 flex items-baseline gap-3"
              style={{ borderTop: '0.5px solid var(--line)' }}
            >
              <span className="font-mono text-[10px]" style={{ color: 'var(--fg-muted)', letterSpacing: '0.12em' }}>
                Σ
              </span>
              <span className="font-mono" style={{ fontSize: '14px', color: '#D4571B' }}>
                {story.summary}
              </span>
            </div>
          </article>
        ))}

        {/* Trailing spacer so last card doesn't hug edge */}
        <div style={{ flex: '0 0 20px' }} aria-hidden="true" />
      </div>

      <style>{`
        @keyframes hintSlide {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(6px); }
        }
      `}</style>
    </section>
  );
}
