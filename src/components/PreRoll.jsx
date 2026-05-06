// PreRoll.jsx — Die Aktenkarte
// ~2.9s diagnostischer Vorhang, der vor dem Hero hochgeht.
// Typewriter mono → italic Newsreader fadet rein → orange Strich zieht durch
// → bottom mono → kurzer Hold → alles fadet aus → onComplete().

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const TIMING = {
  TYPEWRITER_START: 0.1,    // s vor erstem char
  TYPEWRITER_CHAR: 0.038,   // s pro char
  ITALIC_AFTER:   0.25,     // s nach typewriter ende
  ITALIC_DUR:     0.8,
  BOTTOM_AFTER:   0.1,      // s nach italic start
  BOTTOM_DUR:     0.5,
  LINE_AFTER:     0.3,      // s nach italic start
  LINE_DUR:       0.8,
  HOLD:           0.35,     // s nach allem voll sichtbar
  EXIT:           0.45,     // s fade-out
};

export default function PreRoll({ onComplete }) {
  const overlayRef    = useRef(null);
  const monoTopRef    = useRef(null);
  const italicRef     = useRef(null);
  const lineRef       = useRef(null);
  const monoBottomRef = useRef(null);
  const skipHintRef   = useRef(null);

  // Random case number 0050–0500 — jeder visit ist ein anderer fall
  const caseNumberRef = useRef(
    String(50 + Math.floor(Math.random() * 451)).padStart(4, '0')
  );

  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Optional dev escape: ?skip-preroll=1
    const url = new URL(window.location.href);
    const skipParam = url.searchParams.get('skip-preroll');

    if (reduceMotion || skipParam === '1') {
      onComplete();
      return;
    }

    // Body scroll lock
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let typewriterInterval = null;
    let exitTween = null;
    let mainTimeline = null;
    let isComplete = false;

    const finish = () => {
      if (isComplete) return;
      isComplete = true;
      if (typewriterInterval) clearInterval(typewriterInterval);
      if (mainTimeline) mainTimeline.kill();

      exitTween = gsap.to(overlayRef.current, {
        opacity: 0,
        duration: TIMING.EXIT,
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
      if (typewriterInterval) clearInterval(typewriterInterval);
      if (mainTimeline) mainTimeline.kill();

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

    // Wait for fonts (mit fallback timeout damit's nie hängt)
    const fontsReady = Promise.race([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, 500)),
    ]);

    fontsReady.then(() => {
      if (isComplete) return;

      // Initial states
      gsap.set(italicRef.current,     { opacity: 0, y: 12 });
      gsap.set(lineRef.current,       { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(monoBottomRef.current, { opacity: 0 });
      gsap.set(skipHintRef.current,   { opacity: 0 });

      // Skip-hint kommt nach 1.2s leise rein
      gsap.to(skipHintRef.current, {
        opacity: 0.5,
        duration: 0.6,
        delay: 1.2,
        ease: 'power2.out',
      });

      const fullText = `FALL.${caseNumberRef.current} · APION`;

      // Phase 1: Typewriter
      setTimeout(() => {
        if (isComplete) return;
        let charIndex = 0;
        typewriterInterval = setInterval(() => {
          if (charIndex < fullText.length) {
            charIndex += 1;
            setTypedText(fullText.slice(0, charIndex));
          } else {
            clearInterval(typewriterInterval);
            typewriterInterval = null;
            startMainTimeline();
          }
        }, TIMING.TYPEWRITER_CHAR * 1000);
      }, TIMING.TYPEWRITER_START * 1000);

      const startMainTimeline = () => {
        if (isComplete) return;
        mainTimeline = gsap.timeline({
          onComplete: finish,
        });

        // Italic fadet rein mit Y-rise
        mainTimeline.to(italicRef.current, {
          opacity: 1,
          y: 0,
          duration: TIMING.ITALIC_DUR,
          ease: 'power2.out',
        }, TIMING.ITALIC_AFTER);

        // Bottom mono parallel mit kleinem versatz
        mainTimeline.to(monoBottomRef.current, {
          opacity: 1,
          duration: TIMING.BOTTOM_DUR,
          ease: 'power2.out',
        }, `>-${TIMING.ITALIC_DUR - TIMING.BOTTOM_AFTER}`);

        // Orange line draws
        mainTimeline.to(lineRef.current, {
          scaleX: 1,
          duration: TIMING.LINE_DUR,
          ease: 'power2.inOut',
        }, `>-${TIMING.BOTTOM_DUR - TIMING.LINE_AFTER + TIMING.BOTTOM_AFTER}`);

        // Hold
        mainTimeline.to({}, { duration: TIMING.HOLD });
      };
    });

    // Click + Key skip
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
      if (typewriterInterval) clearInterval(typewriterInterval);
      if (mainTimeline) mainTimeline.kill();
      if (exitTween) exitTween.kill();
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
      {/* TOP ROW: case number (left) + skip hint (right) */}
      <div className="flex justify-between items-start w-full">
        <div
          ref={monoTopRef}
          className="font-mono"
          style={{
            color: '#D4571B',
            fontSize: 'clamp(10px, 0.85vw, 12px)',
            letterSpacing: '0.18em',
            minHeight: '1em', // reserves vertical space, kein layout shift
          }}
        >
          {typedText}
          <span
            style={{
              display: 'inline-block',
              width: '0.55em',
              marginLeft: '2px',
              borderBottom: '1px solid #D4571B',
              animation: 'preroll-cursor 0.65s steps(2) infinite',
            }}
          />
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

      {/* CENTER: italic display + orange line */}
      <div className="flex-1 flex items-center w-full">
        <div className="max-w-[1100px]">
          <div
            ref={italicRef}
            style={{
              fontFamily: 'Newsreader, serif',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(36px, 6.4vw, 88px)',
              lineHeight: 1.05,
              color: '#F5F3EE',
              letterSpacing: '-0.012em',
              opacity: 0,
            }}
          >
            Der Mittelstand<br />auf dem Tisch.
          </div>
          <div
            ref={lineRef}
            className="mt-7 md:mt-9"
            style={{
              height: '1px',
              width: 'clamp(96px, 16vw, 220px)',
              background: '#D4571B',
              transform: 'scaleX(0)',
              transformOrigin: 'left center',
            }}
          />
        </div>
      </div>

      {/* BOTTOM: → BEFUND ÖFFNET */}
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

      {/* Cursor blink keyframes (scoped) */}
      <style>{`
        @keyframes preroll-cursor {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
