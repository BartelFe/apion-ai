// PreRoll.jsx — Variante 03: Das Billing-Meter
// ~6.6s viszeraler Vorhang. Header → großer Live-Counter tickt 4 Sekunden,
// während drei italic Verlust-Zeilen ein- und ausfaden. Bei 00:04 freezing,
// orange Linie zieht sich mittig auf, Punchline mit € verloren erscheint, exit.
//
// Konzept: User soll vier Sekunden lang die Zeit FÜHLEN, bevor er sie versteht.

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// Absolute Timeline-Zeitpunkte (in Sekunden) — alles relativ zum Mount
const T = {
  HEADER_IN:    0.10,
  COUNTER_IN:   0.50,
  TICK_1:       1.10,   // 00:00 → 00:01 + line 1 fade in
  TICK_2:       2.10,   // 00:01 → 00:02 + line 2
  TICK_3:       3.10,   // 00:02 → 00:03 + line 3
  TICK_4:       4.10,   // 00:03 → 00:04 + FREEZE
  PUNCHLINE_IN: 4.60,
  BOTTOM_IN:    5.00,
  HOLD_DUR:     0.70,
  EXIT_DUR:     0.50,
};

// Einzelne Fade-Dauern
const FADE = {
  HEADER:    0.4,
  COUNTER:   0.3,
  LINE_IN:   0.3,
  LINE_HOLD: 0.4,
  LINE_OUT:  0.3,
  FREEZE:    0.5,
  PUNCHLINE: 0.6,
  BOTTOM:    0.4,
};

const LOSS_LINES = [
  'ein anruf, der nicht protokolliert wurde',
  'eine excel-datei, die niemand mehr findet',
  'eine sync, die jemand vergessen hat',
];

// Kurierte plausible €-Beträge — vermeidet hässliches Math.random-Fallout
// wie "10,03" oder "11,01". Jede Zahl fühlt sich nach echter Kalkulation an.
const AMOUNTS = [
  '8,40', '9,20', '10,80', '11,60', '12,40',
  '13,20', '13,80', '14,60', '15,20', '16,40',
  '17,20', '17,80',
];

export default function PreRoll({ onComplete }) {
  const overlayRef     = useRef(null);
  const headerRef      = useRef(null);
  const counterRef     = useRef(null);
  const lineRefs       = useRef([]);
  const freezeLineRef  = useRef(null);
  const punchlineRef   = useRef(null);
  const monoBottomRef  = useRef(null);
  const skipHintRef    = useRef(null);

  // €-Betrag wird einmal pro Mount gewählt
  const amountRef = useRef(
    AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)]
  );
  const [counterText, setCounterText] = useState('00:00');

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const url = new URL(window.location.href);
    const skipParam = url.searchParams.get('skip-preroll');

    if (reduceMotion || skipParam === '1') {
      onComplete();
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let isComplete = false;
    let timeline = null;

    const finish = () => {
      if (isComplete) return;
      isComplete = true;
      if (timeline) timeline.kill();
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: T.EXIT_DUR,
        ease: 'power2.inOut',
        onComplete: () => {
          document.body.style.overflow = originalOverflow;
          onComplete();
        },
      });
    };

    const skip = () => {
      if (isComplete) return;
      isComplete = true;
      if (timeline) timeline.kill();
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          document.body.style.overflow = originalOverflow;
          onComplete();
        },
      });
    };

    const fontsReady = Promise.race([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, 500)),
    ]);

    fontsReady.then(() => {
      if (isComplete) return;

      // Initial states
      gsap.set(headerRef.current,     { opacity: 0 });
      gsap.set(counterRef.current,    { opacity: 0, y: 8 });
      gsap.set(freezeLineRef.current, { scaleX: 0, transformOrigin: 'center center' });
      gsap.set(punchlineRef.current,  { opacity: 0, y: 10 });
      gsap.set(monoBottomRef.current, { opacity: 0 });
      gsap.set(skipHintRef.current,   { opacity: 0 });
      lineRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0 });
      });

      // Skip-Hint kommt nach 1.4s — gibt User eine Sekunde sich einzulassen
      // bevor der Escape-Hatch sichtbar wird
      gsap.to(skipHintRef.current, {
        opacity: 0.5,
        duration: 0.6,
        delay: 1.4,
        ease: 'power2.out',
      });

      timeline = gsap.timeline({ onComplete: finish });

      // Phase 1 — Header
      timeline.to(headerRef.current, {
        opacity: 1,
        duration: FADE.HEADER,
        ease: 'power2.out',
      }, T.HEADER_IN);

      // Phase 2 — Counter erscheint mit "00:00"
      timeline.to(counterRef.current, {
        opacity: 1,
        y: 0,
        duration: FADE.COUNTER,
        ease: 'power2.out',
      }, T.COUNTER_IN);

      // Phase 3 — Counter-Ticks via .call()
      // Kein setInterval, weil GSAP-Timeline besser kill-bar ist
      timeline.call(() => setCounterText('00:01'), [], T.TICK_1);
      timeline.call(() => setCounterText('00:02'), [], T.TICK_2);
      timeline.call(() => setCounterText('00:03'), [], T.TICK_3);
      timeline.call(() => setCounterText('00:04'), [], T.TICK_4);

      // Phase 4 — Loss-Zeilen, jeweils synchron mit einem Tick
      [T.TICK_1, T.TICK_2, T.TICK_3].forEach((tickTime, i) => {
        timeline.to(lineRefs.current[i], {
          opacity: 1,
          duration: FADE.LINE_IN,
          ease: 'power2.out',
        }, tickTime);
        timeline.to(lineRefs.current[i], {
          opacity: 0,
          duration: FADE.LINE_OUT,
          ease: 'power2.in',
        }, tickTime + FADE.LINE_IN + FADE.LINE_HOLD);
      });

      // Phase 5 — Freeze-Linie zieht sich bei 00:04 mittig auf
      timeline.to(freezeLineRef.current, {
        scaleX: 1,
        duration: FADE.FREEZE,
        ease: 'power2.inOut',
      }, T.TICK_4);

      // Phase 6 — Punchline mit Y-rise
      timeline.to(punchlineRef.current, {
        opacity: 1,
        y: 0,
        duration: FADE.PUNCHLINE,
        ease: 'power2.out',
      }, T.PUNCHLINE_IN);

      // Phase 7 — Bottom mono "→ BEFUND ÖFFNET"
      timeline.to(monoBottomRef.current, {
        opacity: 1,
        duration: FADE.BOTTOM,
        ease: 'power2.out',
      }, T.BOTTOM_IN);

      // Phase 8 — Hold (gibt der Punchline Zeit zum Wirken)
      timeline.to({}, { duration: T.HOLD_DUR });
    });

    // Skip-Listener
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        skip();
      }
    };
    const overlay = overlayRef.current;
    overlay?.addEventListener('click', skip);
    document.addEventListener('keydown', onKey);

    return () => {
      if (timeline) timeline.kill();
      overlay?.removeEventListener('click', skip);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 flex flex-col cursor-pointer select-none"
      style={{
        background: '#08070A',
        zIndex: 9999,
        padding: 'clamp(20px, 4vw, 48px)',
      }}
      role="presentation"
      aria-hidden="true"
    >
      {/* TOP ROW — header (left) + skip hint (right) */}
      <div className="flex justify-between items-start w-full">
        <div
          ref={headerRef}
          className="font-mono"
          style={{
            color: '#D4571B',
            fontSize: 'clamp(10px, 0.85vw, 12px)',
            letterSpacing: '0.18em',
          }}
        >
          ihre zeit · gerade jetzt
        </div>
        <div
          ref={skipHintRef}
          className="font-mono hidden md:block"
          style={{
            color: '#8B847A',
            fontSize: 'clamp(9px, 0.75vw, 11px)',
            letterSpacing: '0.18em',
            opacity: 0,
          }}
        >
          → ESC / KLICK ZUM ÜBERSPRINGEN
        </div>
      </div>

      {/* CENTER — Counter, Lines, Freeze-Line, Punchline */}
      <div className="flex-1 flex flex-col justify-center items-center w-full">
        {/* Big counter */}
        <div
          ref={counterRef}
          className="font-mono"
          style={{
            color: '#F5F3EE',
            fontSize: 'clamp(80px, 14vw, 200px)',
            letterSpacing: '-0.03em',
            fontWeight: 300,
            lineHeight: 1,
            opacity: 0,
            // tabular-nums = Ziffer-Breiten konstant beim Ticken
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {counterText}
        </div>

        {/* Loss-Zeilen — alle absolut positioniert, gleicher Slot */}
        <div
          className="relative w-full flex items-center justify-center"
          style={{
            minHeight: 'clamp(28px, 3vw, 36px)',
            marginTop: 'clamp(28px, 3.5vw, 56px)',
          }}
        >
          {LOSS_LINES.map((text, i) => (
            <div
              key={i}
              ref={(el) => (lineRefs.current[i] = el)}
              className="absolute text-center"
              style={{
                fontFamily: 'Newsreader, serif',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 'clamp(16px, 1.7vw, 22px)',
                color: '#8B847A',
                whiteSpace: 'nowrap',
                opacity: 0,
                padding: '0 clamp(16px, 4vw, 32px)',
              }}
            >
              {text}
            </div>
          ))}
        </div>

        {/* Freeze-Linie (zieht mittig auf bei 00:04) */}
        <div
          ref={freezeLineRef}
          style={{
            width: 'clamp(96px, 14vw, 200px)',
            height: '1px',
            background: '#D4571B',
            transform: 'scaleX(0)',
            transformOrigin: 'center center',
            marginTop: 'clamp(40px, 5vw, 72px)',
          }}
        />

        {/* Punchline */}
        <div
          ref={punchlineRef}
          className="text-center"
          style={{
            fontFamily: 'Newsreader, serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(20px, 2.6vw, 32px)',
            lineHeight: 1.35,
            color: '#F5F3EE',
            letterSpacing: '-0.005em',
            marginTop: 'clamp(28px, 3vw, 44px)',
            opacity: 0,
            maxWidth: '900px',
            padding: '0 clamp(16px, 4vw, 32px)',
          }}
        >
          In genau dieser Zeit hat ein deutscher Mittelständler{' '}
          <span
            style={{
              color: '#D4571B',
              fontStyle: 'normal',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            ~{amountRef.current} €
          </span>{' '}
          verloren.
        </div>
      </div>

      {/* BOTTOM — → BEFUND ÖFFNET */}
      <div
        ref={monoBottomRef}
        className="font-mono"
        style={{
          color: '#F5F3EE',
          fontSize: 'clamp(11px, 0.9vw, 13px)',
          letterSpacing: '0.2em',
          opacity: 0,
        }}
      >
        → BEFUND ÖFFNET
      </div>
    </div>
  );
}
