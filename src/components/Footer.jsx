import { useEffect } from 'react';
import Logo from './Logo';

// TODO: Vor Launch echte Pages für Impressum/Datenschutz/AGB/Cookies
// verlinken. Aktuell href="#" als Platzhalter — der Dev-Warn unten
// erinnert daran, falls man es vergisst.
const LEGAL_LINKS = [
  ['Impressum', '#'],
  ['Datenschutz', '#'],
  ['AGB', '#'],
  ['Cookies', '#'],
];

export default function Footer() {
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    // Audit every footer link group for placeholder hrefs (#)
    const groups = [
      ['Rechtliches', LEGAL_LINKS],
      ['Unternehmen', [['Über APION', '#manifesto'], ['Karriere', '#'], ['Kontakt', '#cta']]],
      ['Sprache', [['DE · aktiv', '#'], ['EN', '#']]],
    ];
    groups.forEach(([groupName, links]) => {
      links.forEach(([label, href]) => {
        if (href === '#') {
          console.warn(`[Footer] TODO: ${groupName} > "${label}" href="#" — link to actual page before launch.`);
        }
      });
    });
  }, []);

  return (
    <footer
      data-bg="light"
      className="relative px-5 md:px-10 pt-24 pb-20"
      style={{ borderTop: '0.5px solid var(--line)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-10">
          <div className="col-span-2 md:col-span-4">
            <a href="#hero" className="flex items-center gap-3 no-underline" style={{ color: 'var(--fg)' }}>
              <Logo size={32} />
              <span className="font-sans text-sm tracking-logo">APION</span>
            </a>
            <p className="mt-6 font-mono text-[12px]" style={{ color: 'var(--fg-muted)', letterSpacing: '0.04em', maxWidth: '280px', lineHeight: 1.6 }}>
              KI-Prozessautomatisierung für den Mittelstand. Wir arbeiten am unsichtbaren Betrieb.
            </p>
          </div>

          <div className="md:col-span-2">
            <FooterCol title="Inhalte" links={[
              ['Diagnose', '#diagnose'],
              ['Geschichten', '#stories'],
              ['Vorgehen', '#methode'],
              ['Haltung', '#manifesto'],
            ]}/>
          </div>
          <div className="md:col-span-2">
            <FooterCol title="Unternehmen" links={[
              ['Über APION', '#manifesto'],
              ['Karriere', '#'],
              ['Kontakt', '#cta'],
            ]}/>
          </div>
          <div className="md:col-span-2">
            <FooterCol title="Rechtliches" links={LEGAL_LINKS} />
          </div>
          <div className="md:col-span-2">
            <FooterCol title="Sprache" links={[
              ['DE · aktiv', '#'],
              ['EN', '#'],
            ]}/>
          </div>
        </div>

        <div className="mt-20 pt-8 flex flex-col md:flex-row justify-between gap-4 font-mono text-[10px]"
          style={{
            borderTop: '0.5px solid var(--line)',
            color: 'var(--fg-muted)',
            letterSpacing: '0.04em',
          }}>
          <span>© 2026 APION · Digital Process Automation</span>
          <span>built in ingolstadt · for mittelstand</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <div className="font-mono text-[10px] mb-4" style={{ color: 'var(--fg-muted)', letterSpacing: '0.18em' }}>
        {title}
      </div>
      <ul className="space-y-2 list-none">
        {links.map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              className="text-[13px] no-underline"
              style={{ color: 'var(--fg)' }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
