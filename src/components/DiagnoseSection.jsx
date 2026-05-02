import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DiagnoseDiagram from './3d/DiagnoseDiagram';

gsap.registerPlugin(ScrollTrigger);

const PHASES = [
  {
    eyebrow: '01 · diagnose',
    headline: 'Lassen Sie uns einen typischen Tag\nin Ihrem Betrieb durchleuchten.',
    body: 'Was Sie sehen werden, ist eine Rekonstruktion. Eine Annäherung. Aber eine, die fast jeder Mittelständler wiedererkennt.',
  },
  {
    eyebrow: '02 · sichtbarer betrieb',
    headline: '32 Stationen.\n47 Verbindungen.\nSo weit, so klar.',
    body: 'Aufträge laufen. Übergaben funktionieren. Auf dem Papier ist alles in Ordnung.',
  },
  {
    eyebrow: '03 · der unsichtbare betrieb',
    headline: 'Aber sehen Sie diese Pfade?\nDie tauchen in keinem Prozessdiagramm auf.',
    body: 'Doppelpflege. Manuelle Übergaben. Stillstands-Wartezeiten. Niemand hat sie geplant — sie sind einfach entstanden.',
  },
];

const REVEAL_LABELS = [
  { time: '14:32', text: 'doppelpflege CRM ⇄ branchensoftware', cost: '4.2 h/woche', x: '14%', y: '34%' },
  { time: '14:43', text: 'manuelle übergabe lager → versand', cost: '3.1 h/woche', x: '72%', y: '52%' },
  { time: '15:08', text: 'angebots-rückläufer ohne system', cost: '2.7 h/woche', x: '22%', y: '72%' },
  { time: '15:24', text: 'wartezeit freigabe geschäftsführung', cost: '5.6 h/woche', x: '68%', y: '24%' },
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

    // Pin der Sektion über mehrere Viewport-Höhen
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

    // Phasen Cross-fade entlang Scroll-Progress
    const ctx = gsap.context(() => {
      phaseRefs.current.forEach((phase, i) => {
        if (!phase) return;
        const totalPhases = phaseRefs.current.length;
        const phaseStart = i / totalPhases;
        const phaseEnd = (i + 1) / totalPhases;
        // Initial state: nur Phase 0 sichtbar
        gsap.set(phase, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 20 });

        // In + Out Animation pro Phase via ScrollTrigger scrub
        ScrollTrigger.create({
          trigger: section,
          start: `top+=${phaseStart * 100}% top`,
          end: `top+=${phaseEnd * 100}% top`,
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;
            // Fade in in den ersten 30%, halten, fade out in letzten 30%
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

      // Reveal-Labels erscheinen ab 75% des Scroll-Progress
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
      style={{ height: '400vh' }}
    >
      <div
        ref={stickyRef}
        className="relative h-screen w-full overflow-hidden"
        style={{ '--fg': '#F5F3EE', '--fg-muted': '#8B847A', '--line': 'rgba(245, 243, 238, 0.14)', '--line-strong': 'rgba(245, 243, 238, 0.32)' }}
      >

        {/* 3D-Hintergrund */}
        <div className="absolute inset-0">
          <DiagnoseDiagram ref={diagramRef} />
        </div>

        {/* Subtiler Vignette-Verstärker (Inner-Glow nach innen) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, rgba(8,7,10,0.55) 100%)',
          }}
        />

        {/* Eckklammern */}
        <div
          className="absolute inset-x-6 inset-y-12 md:inset-x-10 md:inset-y-16 pointer-events-none bracket-frame"
          style={{ color: 'var(--fg)' }}
        >
          <span className="bk-bl" /><span className="bk-br" />
        </div>

        {/* Phasen-Texte (oben links) */}
        <div className="absolute top-24 md:top-32 left-10 md:left-20 max-w-md md:max-w-lg z-20 pointer-events-none">
          {PHASES.map((phase, i) => (
            <div
              key={i}
              ref={(el) => (phaseRefs.current[i] = el)}
              className="absolute top-0 left-0 w-full"
            >
              <div className="mono-eyebrow flex items-center gap-3" style={{ color: '#D4571B' }}>
                <span className="inline-block w-6 h-px" style={{ background: '#D4571B' }} />
                {phase.eyebrow}
              </div>
              <h2
                className="editorial-display mt-5 whitespace-pre-line"
                style={{
                  fontSize: 'clamp(28px, 3.4vw, 46px)',
                  color: 'var(--fg)',
                }}
              >
                {phase.headline}
              </h2>
              <p
                className="mt-5 max-w-md"
                style={{
                  fontSize: '15px',
                  lineHeight: 1.65,
                  color: 'var(--fg-muted)',
                }}
              >
                {phase.body}
              </p>
            </div>
          ))}
        </div>

        {/* Reveal-Labels (verteilt, erscheinen am Schluss) */}
        {REVEAL_LABELS.map((label, i) => (
          <div
            key={i}
            ref={(el) => (labelRefs.current[i] = el)}
            className="absolute z-20 pointer-events-none"
            style={{
              left: label.x,
              top: label.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="bracket-frame" style={{ color: '#D4571B', padding: '10px 14px' }}>
              <span className="bk-bl" /><span className="bk-br" />
              <div className="font-mono text-[10px]" style={{ color: '#D4571B', letterSpacing: '0.08em' }}>
                {label.time}
              </div>
              <div
                className="font-mono mt-1.5"
                style={{ color: 'var(--fg)', fontSize: '12px', letterSpacing: '0.02em' }}
              >
                {label.text}
              </div>
              <div
                className="mt-1.5 font-mono"
                style={{ color: '#D4571B', fontSize: '11px' }}
              >
                → {label.cost}
              </div>
            </div>
          </div>
        ))}

        {/* Bottom Caption */}
        <div
          className="absolute bottom-16 left-10 md:left-20 right-10 md:right-20 z-20 flex items-end justify-between pointer-events-none"
        >
          <div className="font-mono text-[10px]" style={{ color: 'var(--fg-muted)', letterSpacing: '0.1em' }}>
            scroll-tiefe = analyse-tiefe
          </div>
          <div className="font-mono text-[11px] text-right" style={{ color: 'var(--fg)' }}>
            Σ <span style={{ color: '#D4571B' }}>15.6 h/woche</span>{' '}
            <span style={{ color: 'var(--fg-muted)' }}>· pro mitarbeiter · konservativ geschätzt</span>
          </div>
        </div>
      </div>
    </section>
  );
}
