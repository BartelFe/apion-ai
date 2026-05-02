import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLineReveal } from '../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

export default function ROISection() {
  const headlineRef = useLineReveal('top 72%');
  const sectionRef = useRef(null);
  const controlsRef = useRef(null);
  const outputsRef = useRef(null);
  const [hourly, setHourly] = useState(65);
  const [hours, setHours] = useState(10);
  const [auto, setAuto] = useState(70);

  const yearlyCost = Math.round(hourly * hours * 52);
  const yearlySaved = Math.round(yearlyCost * (auto / 100));
  const yearlyHoursSaved = Math.round(hours * 52 * (auto / 100));

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro paragraph
      gsap.fromTo(
        '[data-roi-intro]',
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '[data-roi-intro]', start: 'top 85%', once: true },
        }
      );

      // Controls slide in from left
      gsap.fromTo(
        controlsRef.current,
        { x: -40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.0, ease: 'power3.out',
          scrollTrigger: { trigger: controlsRef.current, start: 'top 80%', once: true },
        }
      );

      // Output numbers slide in from right with stagger
      gsap.fromTo(
        outputsRef.current?.querySelectorAll('[data-output]') ?? [],
        { x: 40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.9, stagger: 0.18, ease: 'power3.out',
          scrollTrigger: { trigger: outputsRef.current, start: 'top 75%', once: true },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="roi"
      data-bg="light"
      className="relative px-5 md:px-10 pt-32 md:pt-40 pb-32 md:pb-40"
      style={{ '--fg': '#0A0A0B', '--fg-muted': '#6E6E70', '--line': 'rgba(10,10,11,0.12)', '--line-strong': 'rgba(10,10,11,0.35)' }}
    >
      <div className="max-w-6xl mx-auto" ref={headlineRef}>
        <div className="mono-eyebrow flex items-center gap-3" style={{ color: 'var(--fg-muted)' }}>
          <span className="inline-block w-6 h-px" style={{ background: 'var(--fg-muted)' }} />
          02 · was kostet er
        </div>

        <h2
          className="editorial-display mt-7"
          style={{ fontSize: 'clamp(32px, 4.4vw, 60px)', maxWidth: '780px' }}
        >
          <span className="reveal-line"><span>Übersetzen wir den unsichtbaren</span></span>
          <span className="reveal-line"><span>Betrieb in <em>Stunden</em>. Und in <em>Geld</em>.</span></span>
        </h2>

        <p
          data-roi-intro
          className="mt-8 max-w-xl"
          style={{ fontSize: '17px', lineHeight: 1.65, color: 'var(--fg-muted)', opacity: 0 }}
        >
          Stellen Sie hier Ihre Werte ein. Die Rechnung läuft live mit. Keine
          Verkaufsformel — wir nehmen einfach die Mathematik, die ohnehin im
          Hintergrund läuft, und holen sie nach vorne.
        </p>

        <div className="mt-16 md:mt-20 grid md:grid-cols-2 gap-12 md:gap-20">
          <div ref={controlsRef} className="flex flex-col gap-8" style={{ opacity: 0 }}>
            <Slider label="Stundensatz" unit="€/h" min={30} max={150} value={hourly} onChange={setHourly} />
            <Slider label="Stunden Routinen pro Woche" unit="h" min={2} max={30} value={hours} onChange={setHours} />
            <Slider label="Realistischer Automatisierungsgrad" unit="%" min={30} max={95} value={auto} onChange={setAuto} trace />
          </div>

          <div ref={outputsRef} className="relative pl-8 md:pl-10" style={{ borderLeft: '0.5px solid var(--line-strong)' }}>
            <div data-output style={{ opacity: 0 }}>
              <Output label="Jahreskosten manuell" value={`${yearlyCost.toLocaleString('de-DE')} €`} caption="ohne automatisierung · konservativ" />
            </div>
            <div className="my-10 h-px" style={{ background: 'var(--line)' }} />
            <div data-output style={{ opacity: 0 }}>
              <Output label="Einsparung pro Jahr" value={`${yearlySaved.toLocaleString('de-DE')} €`} caption="bei aktuellem automatisierungsgrad" trace />
            </div>
            <div data-output style={{ opacity: 0 }}>
              <Output label="Zurückgewonnene Stunden" value={`${yearlyHoursSaved.toLocaleString('de-DE')} h`} caption="für ihr kerngeschäft" trace />
            </div>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t" style={{ borderColor: 'var(--line)' }}>
          <div className="font-mono text-[11px] mb-3" style={{ color: 'var(--fg-muted)', letterSpacing: '0.05em' }}>
            kleingedrucktes
          </div>
          <p style={{ fontSize: '14px', lineHeight: 1.65, color: 'var(--fg-muted)', maxWidth: '640px' }}>
            Annahme 52 Arbeitswochen, ein Mitarbeiter. Realwerte sind in der
            Regel höher, weil mehrere Personen betroffen sind und Folgekosten
            (Fehler, Nacharbeit, Wartezeiten) hier nicht eingerechnet sind.
          </p>
        </div>
      </div>
    </section>
  );
}

function Slider({ label, unit, min, max, value, onChange, trace = false }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <span className="font-mono text-[11px]" style={{ color: 'var(--fg-muted)', letterSpacing: '0.08em' }}>
          {label}
        </span>
        <span className="editorial-display" style={{ fontSize: '24px', color: trace ? '#D4571B' : 'var(--fg)' }}>
          {value}
          <span className="font-mono text-[11px] ml-1" style={{ color: 'var(--fg-muted)' }}>{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          appearance: 'none',
          WebkitAppearance: 'none',
          height: '2px',
          background: trace
            ? `linear-gradient(to right, #D4571B 0%, #D4571B ${((value - min) / (max - min)) * 100}%, var(--line-strong) ${((value - min) / (max - min)) * 100}%)`
            : `linear-gradient(to right, var(--fg) 0%, var(--fg) ${((value - min) / (max - min)) * 100}%, var(--line-strong) ${((value - min) / (max - min)) * 100}%)`,
          outline: 'none',
          cursor: 'pointer',
        }}
        className="apion-slider"
      />
      <div className="flex justify-between mt-2 font-mono text-[10px]" style={{ color: 'var(--fg-muted)' }}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
      <style>{`
        .apion-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px; height: 14px;
          border-radius: 50%;
          background: var(--fg);
          cursor: pointer;
          border: 2px solid var(--bg-base, #F5F3EE);
        }
        .apion-slider::-moz-range-thumb {
          width: 14px; height: 14px;
          border-radius: 50%;
          background: var(--fg);
          cursor: pointer;
          border: 2px solid var(--bg-base, #F5F3EE);
        }
      `}</style>
    </div>
  );
}

function Output({ label, value, caption, trace = false }) {
  return (
    <div className="mb-1">
      <div className="font-mono text-[10px]" style={{ color: trace ? '#D4571B' : 'var(--fg-muted)', letterSpacing: '0.12em' }}>
        {label}
      </div>
      <div className="editorial-display mt-2" style={{ fontSize: 'clamp(36px, 4vw, 56px)', color: trace ? '#D4571B' : 'var(--fg)' }}>
        {value}
      </div>
      <div className="font-mono text-[11px] mt-2" style={{ color: 'var(--fg-muted)', letterSpacing: '0.04em' }}>
        {caption}
      </div>
    </div>
  );
}
