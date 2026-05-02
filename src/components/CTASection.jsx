import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLineReveal } from '../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef(null);
  const headlineRef = useLineReveal();
  const detailsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        detailsRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay: 0.4,
          ease: 'power3.out',
          scrollTrigger: { trigger: detailsRef.current, start: 'top 85%', once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="cta"
      ref={sectionRef}
      data-bg="vignette"
      className="relative px-5 md:px-10 pt-40 md:pt-56 pb-44 md:pb-56"
      style={{
        background: 'radial-gradient(ellipse 90% 70% at 50% 50%, #08070A 0%, #1A1408 100%)',
        '--fg': '#F5F3EE',
        '--fg-muted': '#8B847A',
        '--line': 'rgba(245, 243, 238, 0.14)',
        '--line-strong': 'rgba(245, 243, 238, 0.32)',
      }}
    >
      <div className="max-w-4xl mx-auto text-center" ref={headlineRef}>
        <div className="mono-eyebrow inline-flex items-center gap-3" style={{ color: '#D4571B' }}>
          <span className="inline-block w-6 h-px" style={{ background: '#D4571B' }} />
          07 · sichtbar machen
          <span className="inline-block w-6 h-px" style={{ background: '#D4571B' }} />
        </div>

        <h2
          className="editorial-display mt-9"
          style={{
            fontSize: 'clamp(36px, 5vw, 80px)',
            color: 'var(--fg)',
          }}
        >
          <span className="reveal-line"><span>30 Minuten.</span></span>
          <span className="reveal-line"><span>Ihr Betrieb.</span></span>
          <span className="reveal-line"><span style={{ color: 'var(--fg-muted)', fontStyle: 'italic' }}>Wir hören zu.</span></span>
        </h2>

        <div ref={detailsRef} className="mt-14 flex flex-col items-center gap-8">
          <a
            href="#"
            className="inline-flex items-center gap-3 group"
            style={{
              color: 'var(--fg)',
              borderBottom: '1px solid var(--fg)',
              paddingBottom: '10px',
              fontSize: '17px',
              fontFamily: 'inherit',
              textDecoration: 'none',
              transition: 'gap 0.3s ease',
            }}
          >
            Erstgespräch vereinbaren
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>

          <div className="font-mono text-[11px] flex flex-wrap items-center justify-center gap-3"
            style={{ color: 'var(--fg-muted)', letterSpacing: '0.05em' }}>
            <span>kostenlos</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>unverbindlich</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>ohne berater-floskeln</span>
          </div>
        </div>
      </div>
    </section>
  );
}
