// StoriesSection.jsx — Drei Diagnosen aus der Praxis
//
// Editorial-Row-Layout mit sichtbarer Bild-Spalte links (3:2 thumb) und
// Text-Spalte rechts. Click expandiert das Detail-Panel inline (Hero-Bild
// 16:9 + Diagnose + Pull-Quote + Messung-Rows).
//
// Bild-Strategie:
// - Case 01 (GEBRÜDER PETERS, named): echtes GP-Projektfoto in beiden
//   Größen (3:2 thumb in der Reihe, 16:9 hero im Detail).
// - Cases 02 + 03 (pseudonymisiert): typografische Plates (SVG) statt
//   Stock-Photos. Editorial-Buchcover-Stil. Brand-coherent, ehrlich
//   abstrakt. Zwei Varianten: 3:2 thumb für die Reihe, 16:9 hero für
//   das Detail.
//
// Layout-Konsistenz: alle Cases haben dieselbe Zeilenstruktur — egal ob
// Foto oder Plate. Das ist das Fundament der "auflockernd"-Wirkung.

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLineReveal } from '../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────────────────────
// CASE-DATEN
// ─────────────────────────────────────────────────────────────────────────────

// GEBRÜDER PETERS Projektfotos — alle drei kanonisch von gebrueder-peters.de.
// FALL.01 nutzt Audi T02 II BA als echtes Klientenfoto (GP ist namentlich
// genannt). FALL.02 + FALL.03 nutzen GVZ Halle B und Audi Forum als
// Symbolbilder für anonymisierte Mandanten — mit Alex/GP abgesprochen.
// Vor Public-Launch alle drei lokal selfhosten in /public/images/cases/
// und Bildnachweis sauber dokumentieren (AUDI AG hält Rechte am Audi-Forum-
// Foto laut GP-Referenzseite, GVZ-Foto ist GP-eigenes Material).
const GP_AUDI_T02      = 'https://www.gebrueder-peters.de/wp-content/uploads/2022/12/ET_AUDI-T02-II-BA-aspect-ratio-1-1-1024x1024.jpg';
const GP_HALLE_B_GVZ   = 'https://www.gebrueder-peters.de/wp-content/uploads/2022/12/ET_GVZ_Ingolstadt-aspect-ratio-1-1.png';
const GP_AUDI_FORUM    = 'https://www.gebrueder-peters.de/wp-content/uploads/2022/12/GM_AUDI-Forum-aspect-ratio-1-1-1024x1024.jpg';

const CASES = [
  {
    caseNo: '01',
    status: 'STAND Q2 2026 · DIAGNOSE-PHASE',
    client: 'GEBRÜDER PETERS',
    meta: 'TGA · INGOLSTADT · 950 MA · 8 STANDORTE · seit 1903',
    headline: 'Der Schaltschrankbau hatte sieben Excel-Listen.',
    patterns: ['01', '04', '02'],
    metric: '~24.700 €',
    metricUnit: '/ jahr',
    metricCaption: 'projizierte einsparung',

    imageType: 'photo',
    imageUrl: GP_AUDI_T02,
    imageCaption: 'Audi T02 II BA, Ingolstadt — eines der TGA-Mandate im Diagnose-Zeitraum',

    detail: {
      intro: 'In drei Wochen Vor-Ort-Analyse haben wir bei GEBRÜDER PETERS drei Schatten-Muster identifiziert. Der priorisierte Pilot-Kandidat: die Eigenfertigung Schaltschrankbau, deren Stücklisten parallel in sieben Excel-Dateien gepflegt werden — die "Master-Liste" ist die achte, niemand pflegt sie offiziell, aber sie ist die einzige, die alle benutzen.',
      pullQuote: {
        text: 'Was wir heute in zwei Stunden machen, hätte uns früher einen Tag gekostet. Und wir hätten gar nicht gemerkt, dass wir den Tag verloren haben.',
        attribution: 'Werkstattleitung · GEBRÜDER PETERS',
      },
      keyMetrics: [
        { label: 'Excel-Listen für Stücklisten',  ist: '7 parallel', ziel: '1 master (ERP)' },
        { label: 'Sync-Arbeit / Woche',           ist: '11.4 h',     ziel: '~1.5 h proj.' },
        { label: 'Manuelle Übergaben / Auftrag',  ist: '4',          ziel: '0' },
      ],
    },
  },

  {
    caseNo: '02',
    status: 'IMPLEMENTIERT Q4 2025',
    client: null,
    meta: 'BAUHANDWERK · SANITÄR · 22 MA · 1 STANDORT',
    headline: 'Die Materialliste, die im Lager nie ankam.',
    patterns: ['03'],
    metric: '−5.8 h',
    metricUnit: '/ wo · pro monteur',
    metricCaption: 'gemessene einsparung',

    imageType: 'photo',
    imageUrl: GP_HALLE_B_GVZ,
    imageCaption: 'Halle B, GVZ Ingolstadt — Symbolbild für anonymisierten Mandanten',

    detail: {
      intro: 'Außenmonteure starteten morgens mit handgeschriebenen Materiallisten, die der Lagerist nicht zuordnen konnte. Disposition organisierte täglich nach. Heute: digitalisiertes Material-Briefing, Lager-Sync in Echtzeit, ein einziger Datenstand zwischen Werkstatt und Außendienst.',
      pullQuote: null,
      keyMetrics: [
        { label: 'Anrufe Lager → Disposition / Tag',     ist: '~14',     ziel: '~3' },
        { label: 'Rückläufer wegen Materialfehler / Wo', ist: '2.2',     ziel: '0.4' },
        { label: 'Stundenzettel-Erfassung / MA / Wo',    ist: '40 min',  ziel: '8 min' },
      ],
    },
  },

  {
    caseNo: '03',
    status: 'IMPLEMENTIERT Q1 2026',
    client: null,
    meta: 'FERTIGUNG · MASCHINENBAU · 64 MA',
    headline: 'Die Freigabe, die niemand traut zu erteilen.',
    patterns: ['02'],
    metric: '−4.2 h',
    metricUnit: '/ wo · entscheidungsstau',
    metricCaption: 'gemessene einsparung',

    imageType: 'photo',
    imageUrl: GP_AUDI_FORUM,
    imageCaption: 'Audi Forum, Ingolstadt — Symbolbild für anonymisierten Mandanten',

    detail: {
      intro: 'Angebote über 25 k€ hingen tagelang in der Schwebe — Geschäftsführung nicht erreichbar, niemand traute sich, Entscheidungen ohne sie zu treffen. Heute: definierte Freigabe-Schwellen je Auftragsvolumen, automatische Eskalation an Stellvertreter, durchschnittliche Liegezeit minus 78 Prozent.',
      pullQuote: null,
      keyMetrics: [
        { label: 'Liegezeit Angebote > 25 k€',   ist: '3.2 tage', ziel: '0.7 tage' },
        { label: 'Eskalations-Anrufe / Wo',      ist: '8',        ziel: '1' },
        { label: 'Vergessene Freigaben / Monat', ist: '1.4',      ziel: '0' },
      ],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function StoriesSection() {
  const sectionRef  = useRef(null);
  const headlineRef = useLineReveal('top 72%');
  const [openCaseNo, setOpenCaseNo] = useState(null);

  useEffect(() => {
    if (!openCaseNo) return;
    const handler = (e) => { if (e.key === 'Escape') setOpenCaseNo(null); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [openCaseNo]);

  return (
    <section
      id="stories"
      ref={sectionRef}
      data-bg="light"
      className="relative px-5 md:px-10 pt-32 md:pt-44 pb-32 md:pb-44"
      style={{
        '--fg': '#0A0A0B',
        '--fg-muted': '#6E6E70',
        '--line': 'rgba(10,10,11,0.12)',
        '--line-strong': 'rgba(10,10,11,0.35)',
      }}
    >
      <div ref={headlineRef} className="max-w-5xl mx-auto mb-24 md:mb-32">
        <div className="mono-eyebrow" style={{ color: 'var(--fg-muted)' }}>
          03 · drei diagnosen
        </div>
        <h2
          className="editorial-display mt-7"
          style={{ fontSize: 'clamp(32px, 4.4vw, 60px)', maxWidth: '780px' }}
        >
          <span className="reveal-line"><span>Drei Betriebe.</span></span>
          <span className="reveal-line"><span>Drei Diagnosen.</span></span>
          <span className="reveal-line">
            <span style={{ color: 'var(--fg-muted)' }}>Drei Behandlungspläne.</span>
          </span>
        </h2>
        <p
          className="mt-7 font-mono"
          style={{ fontSize: '13px', color: 'var(--fg-muted)', letterSpacing: '0.04em' }}
        >
          → Ein Klarname. Zwei pseudonymisiert. Alle Zahlen real.
          <span className="ml-2" style={{ opacity: 0.6 }}>
            · klicke auf eine Reihe für die Diagnose.
          </span>
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="h-px" style={{ background: 'var(--line-strong)' }} />
        {CASES.map((caseData) => (
          <CaseRow
            key={caseData.caseNo}
            data={caseData}
            isOpen={openCaseNo === caseData.caseNo}
            onToggle={() =>
              setOpenCaseNo((prev) => (prev === caseData.caseNo ? null : caseData.caseNo))
            }
          />
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CASE-ROW — 2-Spalten-Layout: Bild-Thumb links + Text-Spalte rechts
// ─────────────────────────────────────────────────────────────────────────────

function CaseRow({ data, isOpen, onToggle }) {
  const wrapRef    = useRef(null);
  const contentRef = useRef(null);
  const articleRef = useRef(null);

  // Open/Close-Animation: misst Content-Höhe, animiert Wrapper-Höhe smooth.
  useEffect(() => {
    const wrap    = wrapRef.current;
    const content = contentRef.current;
    if (!wrap || !content) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isOpen) {
      if (reduceMotion) {
        gsap.set(wrap,    { height: 'auto' });
        gsap.set(content, { opacity: 1, y: 0 });
        return;
      }
      gsap.set(wrap, { height: 'auto' });
      const target = wrap.offsetHeight;
      gsap.set(wrap, { height: 0 });
      gsap.to(wrap, {
        height: target,
        duration: 0.7,
        ease: 'power3.inOut',
        onComplete: () => { gsap.set(wrap, { height: 'auto' }); },
      });
      gsap.fromTo(content,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.18, ease: 'power3.out' }
      );
    } else {
      if (reduceMotion) {
        gsap.set(wrap, { height: 0 });
        return;
      }
      gsap.set(wrap, { height: wrap.offsetHeight });
      gsap.to(wrap, {
        height: 0,
        duration: 0.5,
        ease: 'power3.inOut',
      });
      gsap.to(content, {
        opacity: 0,
        y: 8,
        duration: 0.3,
        ease: 'power2.in',
      });
    }
  }, [isOpen]);

  // Article fade-in beim Scrollen
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (articleRef.current) articleRef.current.style.opacity = '1';
      return;
    }
    const el = articleRef.current;
    if (!el) return;
    gsap.fromTo(el,
      { opacity: 0, y: 16 },
      {
        opacity: 1, y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }
    );
  }, []);

  return (
    <article
      ref={articleRef}
      style={{
        borderBottom: '0.5px solid var(--line-strong)',
        opacity: 0,
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`case-detail-${data.caseNo}`}
        className="block w-full text-left group"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 'clamp(40px, 5vw, 64px) 0',
          color: 'inherit',
          fontFamily: 'inherit',
        }}
      >
        {/* 2-Spalten-Layout: Thumb links, Text rechts */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">

          {/* Bild-Spalte */}
          <div className="md:col-span-4">
            {data.imageType === 'photo' ? (
              <RowImage src={data.imageUrl} alt={data.imageCaption} isOpen={isOpen} />
            ) : (
              <RowPlate
                caseNo={data.caseNo}
                pattern={data.imageData}
                isOpen={isOpen}
              />
            )}
          </div>

          {/* Text-Spalte */}
          <div className="md:col-span-8 flex flex-col">
            {/* Eyebrow */}
            <div
              className="flex items-center gap-3 font-mono mb-6 md:mb-8"
              style={{ fontSize: '11px', letterSpacing: '0.18em' }}
            >
              <span style={{ color: '#D4571B' }}>FALL.{data.caseNo}</span>
              <span style={{ color: 'var(--line-strong)' }}>·</span>
              <span style={{ color: 'var(--fg-muted)' }}>{data.status}</span>
            </div>

            {/* Headline */}
            <h3
              className="editorial-display transition-transform duration-500 group-hover:translate-x-1"
              style={{
                fontSize: 'clamp(24px, 3.2vw, 40px)',
                lineHeight: 1.12,
                letterSpacing: '-0.015em',
                fontStyle: 'italic',
                fontWeight: 300,
              }}
            >
              {data.headline}
            </h3>

            {/* Meta */}
            <div
              className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1 font-mono"
              style={{ fontSize: '11px', letterSpacing: '0.12em' }}
            >
              {data.client && (
                <>
                  <span style={{ color: 'var(--fg)' }}>{data.client}</span>
                  <span style={{ color: 'var(--line-strong)' }}>·</span>
                </>
              )}
              <span style={{ color: 'var(--fg-muted)' }}>{data.meta}</span>
            </div>

            {/* Footer-Reihe — innerhalb der Text-Spalte */}
            <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-4 items-baseline">
              {/* Metric */}
              <div className="md:col-span-5">
                <div
                  className="mono-eyebrow mb-2"
                  style={{ color: 'var(--fg-muted)', letterSpacing: '0.18em' }}
                >
                  → {data.metricCaption}
                </div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span
                    className="editorial-display"
                    style={{
                      fontSize: 'clamp(26px, 3.2vw, 36px)',
                      color: '#D4571B',
                      lineHeight: 1,
                      fontStyle: 'italic',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {data.metric}
                  </span>
                  <span
                    className="font-mono"
                    style={{ fontSize: '11px', color: 'var(--fg-muted)', letterSpacing: '0.04em' }}
                  >
                    {data.metricUnit}
                  </span>
                </div>
              </div>

              {/* Patterns */}
              <div
                className="md:col-span-4 font-mono"
                style={{ fontSize: '11px', color: 'var(--fg-muted)', letterSpacing: '0.12em' }}
              >
                <span style={{ marginRight: '8px' }}>→</span>
                {data.patterns.length === 1
                  ? <>Muster {data.patterns[0]}</>
                  : <>Muster {data.patterns.join(' · ')}</>
                }
              </div>

              {/* CTA */}
              <div
                className="md:col-span-3 md:text-right font-mono"
                style={{ fontSize: '11px', letterSpacing: '0.18em' }}
              >
                <span
                  className="inline-block transition-all duration-300 group-hover:translate-x-1"
                  style={{ color: isOpen ? '#D4571B' : 'var(--fg)' }}
                >
                  {isOpen ? '→ SCHLIESSEN' : '→ FALL ÖFFNEN'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </button>

      {/* Inline-Detail-Wrapper */}
      <div
        ref={wrapRef}
        id={`case-detail-${data.caseNo}`}
        style={{ height: 0, overflow: 'hidden' }}
        aria-hidden={!isOpen}
      >
        <div ref={contentRef} style={{ opacity: 0 }}>
          <CaseDetail data={data} />
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROW IMAGE — 3:2 thumbnail Foto für die Reihe (always visible, links)
// ─────────────────────────────────────────────────────────────────────────────

function RowImage({ src, alt, isOpen }) {
  return (
    <div
      className="relative overflow-hidden transition-all duration-500"
      style={{
        aspectRatio: '3 / 2',
        background: '#E5E1D8',
        outline: isOpen ? '0.5px solid #D4571B' : '0.5px solid transparent',
        outlineOffset: '0',
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="transition-transform duration-700 group-hover:scale-[1.02]"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
          display: 'block',
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROW PLATE — typografisches 3:2 Thumbnail (für pseudonymisierte Cases)
// Buchcover-Stil: italic Pattern-Code-Hero, mono caps darunter, kleine
// header- und footer-Annotationen. Kompakt aber lesbar.
// ─────────────────────────────────────────────────────────────────────────────

function RowPlate({ caseNo, pattern, isOpen }) {
  return (
    <div
      className="relative overflow-hidden transition-all duration-500"
      style={{
        aspectRatio: '3 / 2',
        background: '#EDE9DE',
        border: '0.5px solid var(--line-strong)',
        outline: isOpen ? '0.5px solid #D4571B' : '0.5px solid transparent',
        outlineOffset: '0',
      }}
    >
      <svg
        viewBox="0 0 1200 800"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/* Faint horizontal grid */}
        <g stroke="#0A0A0B" strokeWidth="0.5" opacity="0.04">
          {[120, 240, 360, 480, 600, 720].map((y) => (
            <line key={y} x1="0" y1={y} x2="1200" y2={y} />
          ))}
        </g>

        {/* Top-left: FALL.XX */}
        <text
          x="60" y="100"
          fontFamily="JetBrains Mono, SF Mono, monospace" fontSize="40"
          fill="#6E6E70" letterSpacing="0.18em"
        >
          FALL.{caseNo}
        </text>

        {/* Top-right: MUSTER XX (orange accent) */}
        <text
          x="1140" y="100" textAnchor="end"
          fontFamily="JetBrains Mono, SF Mono, monospace" fontSize="40"
          fill="#D4571B" letterSpacing="0.18em"
        >
          MUSTER {pattern.patternCode}
        </text>

        {/* Faint divider under header */}
        <line x1="60" y1="140" x2="1140" y2="140"
          stroke="#0A0A0B" strokeWidth="0.5" opacity="0.15" />

        {/* The hero: gigantic italic pattern code, centered */}
        <text
          x="600" y="500" textAnchor="middle"
          fontFamily="Newsreader, Iowan Old Style, Charter, Georgia, serif"
          fontStyle="italic" fontWeight="300"
          fontSize="320" fill="#0A0A0B" letterSpacing="-0.04em"
        >
          {pattern.patternCode}
        </text>

        {/* Pattern name in mono caps */}
        <text
          x="600" y="600" textAnchor="middle"
          fontFamily="JetBrains Mono, SF Mono, monospace" fontSize="36"
          fill="#0A0A0B" letterSpacing="0.18em"
        >
          {pattern.patternName.toUpperCase()}
        </text>

        {/* Bottom annotation */}
        <text
          x="600" y="720" textAnchor="middle"
          fontFamily="Newsreader, Iowan Old Style, Charter, Georgia, serif"
          fontStyle="italic" fontWeight="300"
          fontSize="36" fill="#6E6E70"
        >
          pseudonymisierter Fall
        </text>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CASE-DETAIL — expandiert inline · Hero-Bild + Diagnose + Quote + Messung
// ─────────────────────────────────────────────────────────────────────────────

function CaseDetail({ data }) {
  return (
    <div className="pb-16 md:pb-20" style={{ paddingTop: '4px' }}>
      {/* Hero-Bild */}
      {data.imageType === 'photo' ? (
        <PhotoFigure src={data.imageUrl} caption={data.imageCaption} />
      ) : (
        <TypographicPlate caseNo={data.caseNo} pattern={data.imageData} />
      )}

      {/* 2-Spalten unter dem Bild */}
      <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
        <div className="md:col-span-7">
          <div className="mono-eyebrow mb-4" style={{ color: '#D4571B', letterSpacing: '0.18em' }}>
            → DIAGNOSE
          </div>
          <p
            className="editorial-display"
            style={{
              fontSize: 'clamp(16px, 1.7vw, 20px)',
              lineHeight: 1.65,
              fontWeight: 400,
              color: 'var(--fg)',
              maxWidth: '60ch',
            }}
          >
            {data.detail.intro}
          </p>

          {data.detail.pullQuote && (
            <div className="mt-10 pl-5 relative" style={{ maxWidth: '52ch' }}>
              <div
                className="absolute left-0 top-1 bottom-1"
                style={{ width: '2px', background: '#D4571B' }}
              />
              <blockquote
                className="editorial-display"
                style={{
                  fontSize: 'clamp(17px, 1.9vw, 22px)',
                  lineHeight: 1.45,
                  fontStyle: 'italic',
                  fontWeight: 300,
                  margin: 0,
                  color: 'var(--fg)',
                }}
              >
                „{data.detail.pullQuote.text}"
              </blockquote>
              <div
                className="mt-4 font-mono"
                style={{ fontSize: '11px', color: 'var(--fg-muted)', letterSpacing: '0.12em' }}
              >
                → {data.detail.pullQuote.attribution}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-5">
          <div className="mono-eyebrow mb-4" style={{ color: '#D4571B', letterSpacing: '0.18em' }}>
            → MESSUNG · IST vs. ZIEL
          </div>
          <div>
            {data.detail.keyMetrics.map((m, i) => (
              <div
                key={i}
                className="py-4"
                style={{
                  borderBottom: '0.5px solid var(--line)',
                  borderTop: i === 0 ? '0.5px solid var(--line)' : 'none',
                }}
              >
                <div
                  className="font-mono mb-2"
                  style={{
                    fontSize: '11px',
                    color: 'var(--fg-muted)',
                    letterSpacing: '0.06em',
                    lineHeight: 1.4,
                  }}
                >
                  {m.label}
                </div>
                <div className="flex items-baseline gap-3">
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '13px',
                      color: 'var(--fg-muted)',
                      textDecoration: 'line-through',
                      flex: '0 0 auto',
                    }}
                  >
                    {m.ist}
                  </span>
                  <span
                    className="font-mono"
                    style={{ color: 'var(--fg-muted)', flex: '0 0 auto' }}
                  >
                    →
                  </span>
                  <span
                    className="editorial-display"
                    style={{
                      fontSize: '15px',
                      color: '#D4571B',
                      fontStyle: 'italic',
                      lineHeight: 1.3,
                      flex: '1 1 auto',
                    }}
                  >
                    {m.ziel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PHOTO FIGURE — Detail-Größe Foto (16:9 hero)
// ─────────────────────────────────────────────────────────────────────────────

function PhotoFigure({ src, caption }) {
  return (
    <figure>
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '16 / 9', background: '#E5E1D8' }}
      >
        <img
          src={src}
          alt={caption}
          loading="lazy"
          decoding="async"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center center',
            display: 'block',
          }}
        />
      </div>
      <figcaption
        className="mt-3 font-mono"
        style={{ fontSize: '11px', color: 'var(--fg-muted)', letterSpacing: '0.04em', lineHeight: 1.55 }}
      >
        → {caption}
      </figcaption>
    </figure>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPOGRAPHIC PLATE — Detail-Größe (16:9 hero)
// ─────────────────────────────────────────────────────────────────────────────

function TypographicPlate({ caseNo, pattern }) {
  return (
    <figure>
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: '16 / 9',
          background: '#EDE9DE',
          border: '0.5px solid var(--line-strong)',
        }}
      >
        <svg
          viewBox="0 0 1600 900"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%', display: 'block' }}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <g stroke="#0A0A0B" strokeWidth="0.5" opacity="0.04">
            {[120, 240, 360, 480, 600, 720].map((y) => (
              <line key={y} x1="0" y1={y} x2="1600" y2={y} />
            ))}
          </g>

          <text
            x="80" y="100"
            fontFamily="JetBrains Mono, SF Mono, monospace" fontSize="14"
            fill="#6E6E70" letterSpacing="0.18em"
          >
            FALL.{caseNo} · DIAGNOSTISCHE PLATTE
          </text>

          <text
            x="1520" y="100" textAnchor="end"
            fontFamily="JetBrains Mono, SF Mono, monospace" fontSize="14"
            fill="#D4571B" letterSpacing="0.18em"
          >
            MUSTER {pattern.patternCode}
          </text>

          <line x1="80" y1="130" x2="1520" y2="130"
            stroke="#0A0A0B" strokeWidth="0.5" opacity="0.15" />

          <text
            x="800" y="540" textAnchor="middle"
            fontFamily="Newsreader, Iowan Old Style, Charter, Georgia, serif"
            fontStyle="italic" fontWeight="300"
            fontSize="280" fill="#0A0A0B" letterSpacing="-0.04em"
          >
            {pattern.patternCode}
          </text>

          <text
            x="800" y="630" textAnchor="middle"
            fontFamily="JetBrains Mono, SF Mono, monospace" fontSize="22"
            fill="#0A0A0B" letterSpacing="0.18em"
          >
            {pattern.patternName.toUpperCase()}
          </text>

          <text
            x="800" y="690" textAnchor="middle"
            fontFamily="Newsreader, Iowan Old Style, Charter, Georgia, serif"
            fontStyle="italic" fontWeight="300"
            fontSize="20" fill="#6E6E70"
          >
            pseudonymisierter Fall · symbolische Visualisierung
          </text>

          <line x1="80" y1="800" x2="1520" y2="800"
            stroke="#0A0A0B" strokeWidth="0.5" opacity="0.15" />

          <text
            x="80" y="840"
            fontFamily="JetBrains Mono, SF Mono, monospace" fontSize="13"
            fill="#6E6E70" letterSpacing="0.12em"
          >
            → kein klientenfoto · datenschutz
          </text>
          <text
            x="1520" y="840" textAnchor="end"
            fontFamily="JetBrains Mono, SF Mono, monospace" fontSize="13"
            fill="#6E6E70" letterSpacing="0.12em"
          >
            zahlen · gemessen · n=1
          </text>
        </svg>
      </div>
      <figcaption
        className="mt-3 font-mono"
        style={{ fontSize: '11px', color: 'var(--fg-muted)', letterSpacing: '0.04em', lineHeight: 1.55 }}
      >
        → Diagnostische Plate · Muster {pattern.patternCode} ({pattern.patternName}) ·
        statt Klientenfoto
      </figcaption>
    </figure>
  );
}
