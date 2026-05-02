import { useEffect, useState } from 'react';
import Logo from './Logo';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
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
      <a href="#" className="flex items-center gap-3 no-underline" style={{ color: 'inherit' }}>
        <Logo size={28} />
        <span className="font-sans text-sm tracking-logo">APION</span>
      </a>

      <ul className="hidden md:flex gap-9 list-none">
        {[
          ['Leistungen', '#leistungen'],
          ['Branchenbeispiele', '#stories'],
          ['Vorgehen', '#methode'],
          ['APION', '#manifesto'],
        ].map(([label, href]) => (
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
    </nav>
  );
}
