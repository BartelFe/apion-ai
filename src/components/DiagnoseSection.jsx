import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DiagnoseDiagram from './3d/DiagnoseDiagram';

gsap.registerPlugin(ScrollTrigger);

const PHASES = [
  {
    eyebrow: '01 · diagnose',
    headline: 'Lassen Sie uns einen\ntypischen Tag in Ihrem\nBetrieb durchleuchten.',
    body: 'Was Sie sehen werden, ist eine Rekonstruktion. Eine Annäherung. Aber eine, die fast jeder Mittelständler wiedererkennt.',
  },
  {
    eyebrow: '02 · sichtbarer betrieb',
    headline: '32 Stationen.\n47 Verbindungen.\nSo weit, so klar.',
    body: 'Aufträge laufen. Übergaben funktionieren. Auf dem Papier ist alles in Ordnung.',
  },
  {
    eyebrow: '03 · der unsichtbare betrieb',
    headline: 'Aber sehen Sie diese Pfade?\nDie tauchen in keinem\nProzessdiagramm auf.',
    body: 'Doppelpflege. Manuelle Übergaben. Stillstands-Wartezeiten. Niemand hat sie geplant — sie sind einfach entstanden.',
  },
];

const REVEAL_LABELS = [
  { time: '14:32', text: 'doppelpflege CRM ⇄ branchensoftware', cost: '4.2 h/woche', x: '18%', y: '32%' },
  { time: '14:43', text: 'manuelle übergabe lager → versand',   cost: '3.1 h/woche', x: '68%', y: '55%' },
  { time: '15:08', text: 'angebots-rückläufer ohne system',      cost: '2.7 h/woche', x: '22%', y: '70%' },
  { time: '15:24', text: 'wartezeit freigabe geschäftsführung',  cost: '5.6 h/woche', x: '62%', y: '22%' },
];

export default function DiagnoseSection() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const diagramRef = useRef(null);
  const phaseRefs = useRef([]);
  const labelRefs = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    if (!section || !sticky) return;

    // Reduced-Motion: keinen Pin/Scrub einrichten — letzte Phase statisch
    // anzeigen + Diagramm auf Final-Progress, damit Inhalte sichtbar bleiben.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      diagramRef.current?.setProgress(1);
      phaseRefs.current.forEach((phase, i) => {
        if (!phase) return;
        const isLast = i === phaseRefs.current.length - 1;
        gsap.set(phase, { opacity: isLast ? 1 : 0, y: 0 });
      });
      labelRefs.current.forEach((label) => {
        if (label) gsap.set(label, { opacity: 1, scale: 1 });
      });
      return;
    }

    const pin = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=300%',
      pin: sticky,
      pinSpacing: true,
      scrub: 0.6,
      onUpdate: (self) => {
        diagramRef.current?.setProgress(self.progress);
      },
    });

    const ctx = gsap.context(() => {
      phaseRefs.current.forEach((phase, i) => {
        if (!phase) return;
        const totalPhases = phaseRefs.current.length;
        const phaseStart = i / totalPhases;
        const phaseEnd = (i + 1) / totalPhases;
        gsap.set(phase, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 20 });

        ScrollTrigger.create({
          trigger: section,
          start: `top+=${phaseStart * 100}% top`,
          end: `top+=${phaseEnd * 100}% top`,
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;
            let opacity = 0;
            let y = 20;
            if (p < 0.3) {
              opacity = p / 0.3;
              y = 20 - (p / 0.3) * 20;
            } else if (p < 0.7) {
              opacity = 1;
              y = 0;
            } else {
              opacity = 1 - (p - 0.7) / 0.3;
              y = -((p - 0.7) / 0.3) * 20;
            }
            gsap.set(phase, { opacity, y });
          },
        });
      });

      labelRefs.current.forEach((label, i) => {
        if (!label) return;
        gsap.set(label, { opacity: 0, scale: 0.85 });
        ScrollTrigger.create({
          trigger: section,
          start: `top+=${75 + i * 4}% top`,
          end: `top+=${85 + i * 4}% top`,
          scrub: 0.4,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(label, { opacity: p, scale: 0.85 + p * 0.15 });
          },
        });
      });
    }, section);

    return () => {
      pin.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="diagnose"
      ref={sectionRef}
      data-bg="vignette"
      className="relative"
      // pinSpacing:true im ScrollTrigger fügt die Scroll-Länge automatisch
      // hinzu — kein eigenes height: 400vh nötig (würde sonst 100vh
      // Dead-Space am Ende erzeugen).
      style={{ background: '#08070A' }}
    >
      {/*
        Sticky viewport-height container.
        Mobile:  flex-col — canvas on top (42% height), text below (flex-1)
        Desktop: flex-row — text left (42% width), canvas right (flex-1)
      */}
      <div
        ref={stickyRef}
        className="flex flex-col md:flex-row h-screen w-full overflow-hidden"
        style={{
          '--fg': '#F5F3EE',
          '--fg-muted': '#8B847A',
          '--line': 'rgba(245, 243, 238, 0.14)',
          '--line-strong': 'rgba(245, 243, 238, 0.32)',
        }}
      >

        {/* ── CANVAS PANEL ── order-1 mobile top / order-2 desktop right */}
        <div className="diagnose-canvas-panel order-1 md:order-2">

          {/* 3D diagram fills the entire panel */}
          <DiagnoseDiagram ref={diagramRef} />

          {/* Edge vignette so labels read cleanly */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 38%, rgba(8,7,10,0.65) 100%)',
            }}
          />

          {/* Reveal labels — desktop only */}
          {REVEAL_LABELS.map((label, i) => (
            <div
              key={i}
              ref={(el) => (labelRefs.current[i] = el)}
              className="hidden md:block absolute pointer-events-none"
              style={{ left: label.x, top: label.y, transform: 'translate(-50%, -50%)' }}
            >
              <div
                style={{
                  background: 'rgba(8,7,10,0.84)',
                  border: '0.5px solid rgba(245,243,238,0.22)',
                  borderRadius: '2px',
                  padding: '7px 11px',
                  maxWidth: '195px',
                }}
              >
                <div className="font-mono" style={{ fontSize: '10px', color: '#D4571B', letterSpacing: '0.12em', marginBottom: '3px' }}>
                  {label.time}
                </div>
                <div className="font-mono" style={{ fontSize: '11px', color: '#F5F3EE', lineHeight: 1.4 }}>
                  {label.text}
                </div>
                <div className="font-mono" style={{ fontSize: '10px', color: '#8B847A', marginTop: '3px' }}>
                  {label.cost}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── TEXT PANEL ── order-2 mobile bottom / order-1 desktop left */}
        <div className="diagnose-text-panel order-2 md:order-1 px-7 py-8 md:px-12 md:py-0 z-10">

          {/* Desktop right-border separator */}
          <div
            className="hidden md:block absolute right-0 top-0 bottom-0 w-px"
            style={{ background: 'rgba(245,243,238,0.1)' }}
          />

          {/* Mobile top-border separator */}
          <div
            className="md:hidden absolute top-0 left-0 right-0 h-px"
            style={{ background: 'rgba(245,243,238,0.1)' }}
          />

          {/* Phase text stack */}
          <div className="relative" style={{ minHeight: '200px' }}>
            {PHASES.map((phase, i) => (
              <div
                key={i}
                ref={(el) => (phaseRefs.current[i] = el)}
                className="absolute top-0 left-0 w-full"
              >
                <div className="mono-eyebrow" style={{ color: '#D4571B' }}>
                  {phase.eyebrow}
                </div>
                <h2
                  className="editorial-display mt-4 whitespace-pre-line"
                  style={{
                    fontSize: 'clamp(16px, 1.55vw, 23px)',
                    color: 'var(--fg)',
                    lineHeight: 1.28,
                  }}
                >
                  {phase.headline}
                </h2>
                <p
                  className="mt-4"
                  style={{
                    fontSize: '13px',
                    lineHeight: 1.65,
                    color: 'var(--fg-muted)',
                    maxWidth: '320px',
                  }}
                >
                  {phase.body}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom caption — desktop only */}
          <div className="hidden md:block absolute bottom-10 left-12 right-4 pointer-events-none">
            <div className="font-mono text-[10px]" style={{ color: 'var(--fg-muted)', letterSpacing: '0.1em' }}>
              scroll-tiefe = analyse-tiefe
            </div>
            <div className="font-mono text-[11px] mt-2" style={{ color: 'var(--fg)' }}>
              Σ <span style={{ color: '#D4571B' }}>15.6 h/woche</span>{' '}
              <span style={{ color: 'var(--fg-muted)', fontSize: '10px' }}>· pro mitarbeiter · konservativ geschätzt</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
