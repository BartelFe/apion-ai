import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Logo from './Logo';

const NAV_LINKS = [
  ['Leistungen', '#leistungen'],
  ['Branchenbeispiele', '#stories'],
  ['Vorgehen', '#methode'],
  ['APION', '#manifesto'],
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const overlayRef = useRef(null);
  const linksRef = useRef([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile-Overlay: Open/Close mit GSAP, Body-Scroll-Lock, ESC schließt.
  useEffect(() => {
    if (!overlayRef.current) return;
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      gsap.set(overlayRef.current, { display: 'flex' });
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(
        linksRef.current.filter(Boolean),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out', delay: 0.08 }
      );
    } else {
      document.body.style.overflow = '';
      const el = overlayRef.current;
      gsap.to(el, {
        opacity: 0,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => { if (el) el.style.display = 'none'; },
      });
    }
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Cleanup, falls Komponent während offenen Menüs unmountet
  useEffect(() => () => { document.body.style.overflow = ''; }, []);

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 px-6 md:px-10 py-5 flex items-center justify-between transition-colors duration-300 ${
          scrolled ? 'border-b' : ''
        }`}
        style={{
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          background: scrolled ? 'rgba(245, 243, 238, 0.55)' : 'transparent',
          borderColor: 'var(--line)',
          color: 'var(--fg)',
        }}
      >
        <a href="#hero" className="flex items-center gap-3 no-underline" style={{ color: 'inherit' }}>
          <Logo size={28} />
          <span className="font-sans text-sm tracking-logo">APION</span>
        </a>

        <ul className="hidden md:flex gap-9 list-none">
          {NAV_LINKS.map(([label, href]) => (
            <li key={href}>
              <a
                href={href}
                className="relative text-[13px] no-underline pb-1 group"
                style={{ color: 'inherit' }}
              >
                {label}
                <span
                  className="absolute left-0 bottom-0 h-px w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: 'currentColor' }}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {/* Mobile-Hamburger — 2 Bars (3px × 22px), reine CSS, keine Icon-Lib */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Menü öffnen"
            aria-expanded={menuOpen}
            className="md:hidden relative w-[26px] h-[18px] flex flex-col justify-between"
            style={{ color: 'inherit' }}
          >
            <span className="block w-full" style={{ height: '2px', background: 'currentColor' }} />
            <span className="block w-full" style={{ height: '2px', background: 'currentColor' }} />
          </button>

          <a
            href="#cta"
            className="font-mono text-[11px] no-underline px-4 py-2.5 inline-flex items-center gap-2 transition-all duration-300 group"
            style={{ color: 'inherit', border: '0.5px solid currentColor' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--fg)';
              e.currentTarget.style.color = 'var(--bg-edge)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'inherit';
            }}
          >
            Erstgespräch
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        </div>
      </nav>

      {/* Mobile-Overlay — fullscreen, blurred, editorial typo */}
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Hauptmenü"
        className="md:hidden fixed inset-0 z-50 flex-col items-start justify-center px-8"
        style={{
          display: 'none',
          background: 'rgba(245, 243, 238, 0.96)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          // Lokales --fg-Override: Overlay ist immer hellgrundig, also dunkler Text
          // unabhängig von der dahinter liegenden Section.
          '--fg': '#0A0A0B',
          '--fg-muted': '#6E6E70',
          color: 'var(--fg)',
        }}
      >
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          aria-label="Menü schließen"
          className="absolute top-5 right-6 w-12 h-12 flex items-center justify-center font-mono text-2xl"
          style={{ color: 'var(--fg)' }}
        >
          ✕
        </button>

        <ul className="list-none flex flex-col gap-7 mt-12">
          {NAV_LINKS.map(([label, href], i) => (
            <li key={href}>
              <a
                ref={(el) => (linksRef.current[i] = el)}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="editorial-display no-underline block"
                style={{
                  fontSize: 'clamp(28px, 7vw, 40px)',
                  color: 'var(--fg)',
                  lineHeight: 1.1,
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#cta"
          onClick={() => setMenuOpen(false)}
          className="absolute bottom-12 left-8 font-mono text-[12px] no-underline inline-flex items-center gap-2 pb-1"
          style={{ color: 'var(--fg)', borderBottom: '1px solid currentColor' }}
        >
          Erstgespräch vereinbaren <span>→</span>
        </a>
      </div>
    </>
  );
}
