import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { INTRO, PATTERNS, OUTRO } from './patterns.config';
import {
  FingerprintIntro,
  FingerprintCRM,
  FingerprintPhone,
  FingerprintWhatsApp,
  FingerprintWhiteboard,
  FingerprintOutro,
} from './fingerprints';

gsap.registerPlugin(ScrollTrigger);

// Mappt Scroll-Progress (0..1) auf Phase-Index (0..5).
// Intro 0–12% · Pattern 1 12–32% · Pattern 2 32–52% ·
// Pattern 3 52–72% · Pattern 4 72–92% · Outro 92–100%
const PHASE_BREAKS = [0.12, 0.32, 0.52, 0.72, 0.92];

function activeFromProgress(p) {
  for (let i = 0; i < PHASE_BREAKS.length; i++) {
    if (p < PHASE_BREAKS[i]) return i;
  }
  return PHASE_BREAKS.length;
}

export default function DiagnoseSection() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    if (!section || !sticky) return;

    // Reduced-motion: skip pin/scrub, render outro immediately so user sees synthesis.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActive(5);
      return;
    }

    let lastActive = -1;
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=400%',
      pin: sticky,
      pinSpacing: true,
      scrub: 0.4,
      onUpdate: (self) => {
        const idx = activeFromProgress(self.progress);
        if (idx !== lastActive) {
          lastActive = idx;
          setActive(idx);
        }
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section
      id="diagnose"
      ref={sectionRef}
      data-bg="vignette"
      className="relative"
      style={{ background: '#08070A' }}
    >
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

        {/* ── VIZ PANEL ── order-1 mobile top / order-2 desktop right */}
        <div className="diagnose-canvas-panel order-1 md:order-2 relative">
          <div
            className="absolute inset-0"
            style={{ display: 'grid', gridTemplate: '1fr / 1fr' }}
          >
            <FingerprintSlot active={active === 0}><FingerprintIntro /></FingerprintSlot>
            <FingerprintSlot active={active === 1}><FingerprintCRM /></FingerprintSlot>
            <FingerprintSlot active={active === 2}><FingerprintPhone /></FingerprintSlot>
            <FingerprintSlot active={active === 3}><FingerprintWhatsApp /></FingerprintSlot>
            <FingerprintSlot active={active === 4}><FingerprintWhiteboard /></FingerprintSlot>
            <FingerprintSlot active={active === 5}><FingerprintOutro /></FingerprintSlot>
          </div>

          {/* Edge vignette so labels stay readable over fingerprint detail */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 38%, rgba(8,7,10,0.65) 100%)',
            }}
          />

          {/* Phase progress indicator — top right */}
          <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-1.5 z-10 pointer-events-none">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className="block transition-all duration-500 ease-out"
                style={{
                  width: i === active ? '24px' : '6px',
                  height: '1.5px',
                  background: i === active ? '#D4571B' : 'rgba(245,243,238,0.28)',
                }}
              />
            ))}
          </div>
        </div>

        {/* ── TEXT PANEL ── order-2 mobile bottom / order-1 desktop left */}
        <div
          className="diagnose-text-panel order-2 md:order-1 relative"
          style={{ display: 'grid', gridTemplate: '1fr / 1fr' }}
        >
          {/* Desktop right separator */}
          <div
            className="hidden md:block absolute right-0 top-0 bottom-0 w-px z-10 pointer-events-none"
            style={{ background: 'rgba(245,243,238,0.1)' }}
          />
          {/* Mobile top separator */}
          <div
            className="md:hidden absolute top-0 left-0 right-0 h-px z-10 pointer-events-none"
            style={{ background: 'rgba(245,243,238,0.1)' }}
          />

          <PhaseSlot active={active === 0}><IntroText /></PhaseSlot>
          <PhaseSlot active={active === 1}><PatternText pattern={PATTERNS[0]} /></PhaseSlot>
          <PhaseSlot active={active === 2}><PatternText pattern={PATTERNS[1]} /></PhaseSlot>
          <PhaseSlot active={active === 3}><PatternText pattern={PATTERNS[2]} /></PhaseSlot>
          <PhaseSlot active={active === 4}><PatternText pattern={PATTERNS[3]} /></PhaseSlot>
          <PhaseSlot active={active === 5}><OutroText /></PhaseSlot>
        </div>

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Layer wrappers — alle Phasen werden im selben Grid-Cell gerendert,
// nur die aktive ist sichtbar (opacity 1).
// ─────────────────────────────────────────────────────────────────────────────

function FingerprintSlot({ active, children }) {
  return (
    <div
      className="transition-opacity duration-500 ease-out"
      style={{
        gridArea: '1 / 1',
        opacity: active ? 1 : 0,
        pointerEvents: active ? 'auto' : 'none',
      }}
    >
      {children}
    </div>
  );
}

function PhaseSlot({ active, children }) {
  return (
    <div
      className="px-7 py-10 md:px-12 md:py-14 transition-opacity duration-500 ease-out"
      style={{
        gridArea: '1 / 1',
        opacity: active ? 1 : 0,
        pointerEvents: active ? 'auto' : 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'auto',
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase-Inhalte
// ─────────────────────────────────────────────────────────────────────────────

function IntroText() {
  return (
    <div>
      <div className="mono-eyebrow" style={{ color: '#D4571B', letterSpacing: '0.18em' }}>
        {INTRO.eyebrow}
      </div>
      <h2
        className="editorial-display mt-6 whitespace-pre-line"
        style={{
          fontSize: 'clamp(26px, 3.8vw, 44px)',
          color: 'var(--fg)',
          lineHeight: 1.18,
        }}
      >
        {INTRO.headline}
      </h2>
      <p
        className="editorial-display mt-3"
        style={{
          fontSize: 'clamp(20px, 2.6vw, 30px)',
          color: 'var(--fg-muted)',
          fontStyle: 'italic',
          fontWeight: 300,
        }}
      >
        {INTRO.sub}
      </p>
      <div
        className="mt-10 h-px"
        style={{ background: '#D4571B', width: '64px' }}
      />
      <p
        className="mt-6 font-mono"
        style={{ fontSize: '13px', color: 'var(--fg-muted)', letterSpacing: '0.04em' }}
      >
        {INTRO.caption}
      </p>
    </div>
  );
}

function PatternText({ pattern }) {
  return (
    <div>
      {/* Eyebrow + progress */}
      <div className="flex items-center gap-3">
        <span
          className="font-mono"
          style={{ fontSize: '11px', color: '#D4571B', letterSpacing: '0.18em' }}
        >
          {pattern.eyebrow}
        </span>
        <span
          className="block h-px flex-1"
          style={{ background: 'rgba(212,87,27,0.3)', maxWidth: '80px' }}
        />
      </div>

      {/* Pattern name */}
      <h2
        className="editorial-display mt-4"
        style={{
          fontSize: 'clamp(26px, 3.4vw, 40px)',
          color: 'var(--fg)',
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
        }}
      >
        {pattern.name}
      </h2>

      {/* Wir finden ihn bei: */}
      <div className="mt-7">
        <div
          className="mono-eyebrow mb-2"
          style={{ color: 'var(--fg-muted)', letterSpacing: '0.14em' }}
        >
          → wir finden ihn bei
        </div>
        <ul className="list-none pl-0 m-0 space-y-1">
          {pattern.foundIn.map((line, i) => (
            <li
              key={i}
              className="font-mono"
              style={{ fontSize: '12px', color: 'var(--fg)', letterSpacing: '0.02em' }}
            >
              <span style={{ color: 'var(--fg-muted)', marginRight: '8px' }}>·</span>
              {line}
            </li>
          ))}
        </ul>
      </div>

      {/* Wie er sich anfühlt — pull quote */}
      <div className="mt-7 relative" style={{ paddingLeft: '14px' }}>
        <div
          className="absolute left-0 top-1 bottom-1 w-[2px]"
          style={{ background: '#D4571B' }}
        />
        <div
          className="mono-eyebrow mb-2"
          style={{ color: 'var(--fg-muted)', letterSpacing: '0.14em' }}
        >
          → wie er sich anfühlt
        </div>
        <p
          className="editorial-display"
          style={{
            fontSize: 'clamp(15px, 1.5vw, 18px)',
            color: 'var(--fg)',
            fontStyle: 'italic',
            lineHeight: 1.5,
            fontWeight: 300,
          }}
        >
          „{pattern.feeling}"
        </p>
      </div>

      {/* Schaden in Zahlen */}
      <div className="mt-7">
        <div
          className="mono-eyebrow mb-3"
          style={{ color: 'var(--fg-muted)', letterSpacing: '0.14em' }}
        >
          → schaden in zahlen
        </div>
        <div className="flex flex-col gap-2">
          {pattern.damages.map((d, i) => (
            <div key={i} className="flex items-baseline gap-3">
              <span
                className="editorial-display"
                style={{ fontSize: 'clamp(20px, 2vw, 26px)', color: '#D4571B', lineHeight: 1 }}
              >
                {d.value}
              </span>
              <span
                className="font-mono"
                style={{ fontSize: '11px', color: 'var(--fg-muted)', letterSpacing: '0.04em' }}
              >
                {d.unit}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom annotation — nur wenn vorhanden (z.B. CRM-Pattern lässt
          sie absichtlich leer, weil die Zeile bereits im SVG steht). */}
      {pattern.annotation && (
        <div
          className="mt-8 pt-4 font-mono"
          style={{
            borderTop: '0.5px solid var(--line)',
            fontSize: '10px',
            color: 'var(--fg-muted)',
            letterSpacing: '0.12em',
          }}
        >
          {pattern.annotation}
        </div>
      )}
    </div>
  );
}

function OutroText() {
  return (
    <div>
      {/* Orange accent bar */}
      <div
        className="h-px"
        style={{ background: '#D4571B', width: '80px' }}
      />

      <div className="mono-eyebrow mt-6" style={{ color: '#D4571B', letterSpacing: '0.18em' }}>
        {OUTRO.eyebrow}
      </div>

      <h2
        className="editorial-display mt-6 whitespace-pre-line"
        style={{
          fontSize: 'clamp(28px, 4vw, 48px)',
          color: 'var(--fg)',
          lineHeight: 1.12,
          letterSpacing: '-0.015em',
        }}
      >
        {OUTRO.headline}
      </h2>

      <p
        className="editorial-display mt-4"
        style={{
          fontSize: 'clamp(18px, 2.2vw, 26px)',
          color: 'var(--fg-muted)',
          fontStyle: 'italic',
          fontWeight: 300,
        }}
      >
        {OUTRO.sub}
      </p>

      <div className="mt-12 pt-6"
        style={{ borderTop: '0.5px solid var(--line)' }}>
        <a
          href="#roi"
          className="font-mono no-underline inline-flex items-center gap-2 group"
          style={{
            fontSize: '13px',
            color: '#D4571B',
            letterSpacing: '0.08em',
            paddingBottom: '4px',
            borderBottom: '1px solid #D4571B',
          }}
        >
          {OUTRO.next}
        </a>
      </div>
    </div>
  );
}
