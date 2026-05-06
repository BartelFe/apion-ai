// StoriesSection.jsx — Drei Diagnosen aus der Praxis
//
// Featured case: GEBRÜDER PETERS (TGA-Mittelstand, 950 MA, 8 Standorte).
// Klarname OK für Pitch-Phase, Alex ist dort engaged. Vor Public-Launch
// (siehe Footer-Hinweis bei den Bildern) Bildrechte sauber klären.
//
// Supporting cases: anonymisiert, IMPLEMENTIERT-Status — Track-Record-Beleg.
// Sie sollen NICHT mit dem Featured-Case visuell konkurrieren; ihre Aufgabe
// ist "wir haben das schon mehrfach geliefert", nicht "schaut auch hier".
//
// Theme: light/paper. Bewusster Bruch zur dunklen Diagnose-Section weiter
// oben — Atempause durch Bildräume, nicht durch Inhaltsleere.

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLineReveal } from '../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

// GEBRÜDER PETERS Projektfotos — kanonische wp-content/uploads URLs.
// Sind beständig (kein /slider/cache/ Hash), aber TROTZDEM:
// vor Public-Launch lokal selfhosten in /public/images/cases/gp-*.jpg
// und Bildrechte mit Alex/GP klären.
const GP_IMAGES = {
  hero:       'https://www.gebrueder-peters.de/wp-content/uploads/2022/12/ET_AUDI-T02-II-BA-aspect-ratio-1-1-1024x1024.jpg',
  schmerz:    'https://www.gebrueder-peters.de/wp-content/uploads/2022/12/Schaltschrankbau-scaled-aspect-ratio-1-1-1024x1024.jpg',
  resolution: 'https://www.gebrueder-peters.de/wp-content/uploads/2022/12/GM_AUDI-Forum-aspect-ratio-1-1-1024x1024.jpg',
};

const FEATURED = {
  caseNo: '01',
  status: 'STAND Q2 2026 · DIAGNOSE-PHASE',
  client: 'GEBRÜDER PETERS',
  meta:   'TGA · INGOLSTADT · 950 MA · 8 STANDORTE · seit 1903',

  headline: 'Der Schaltschrankbau hatte\nsieben Excel-Listen.',

  imageHeroCaption:
    'Audi T02 II BA, Ingolstadt — eines der TGA-Mandate im Diagnose-Zeitraum.',

  befund: {
    intro:
      'In drei Wochen Vor-Ort-Analyse haben wir bei GEBRÜDER PETERS drei Schatten-Muster identifiziert — und einen Pilot-Kandidaten priorisiert.',
    patterns: [
      {
        code: 'MUSTER 01',
        name: 'Der Excel-Schatten-CRM',
        detail:
          'Die Eigenfertigung Schaltschrankbau pflegt Stücklisten parallel in sieben Excel-Dateien. Die „Master-Liste" ist die achte — keine offiziell pflegt sie, aber sie ist die einzige, die alle benutzen.',
      },
      {
        code: 'MUSTER 04',
        name: 'Die Drei-Quellen-Sync',
        detail:
          'Die Disposition koordiniert acht Standorte über Whiteboard im HQ, Excel auf dem Server, Outlook in der Cloud. Drei parallele Wahrheiten, niemand definiert als primary.',
      },
      {
        code: 'MUSTER 02',
        name: 'Die Telefon-Disposition',
        detail:
          'Die Service-Wartung über alle Gewerke läuft verbal — Außenmonteure rufen ins HQ, HQ ruft Standorte an. Keine Datenbank fängt den Stand ein.',
      },
    ],
  },

  imageSchmerzCaption:
    'Eigener Schaltschrankbau, Ingolstadt — wo sich die Excel-Listen vermehrt haben.',

  pullQuote: {
    text:
      'Was wir heute in zwei Stunden machen, hätte uns früher einen Tag gekostet. Und wir hätten gar nicht gemerkt, dass wir den Tag verloren haben.',
    attribution: 'Werkstattleitung · GEBRÜDER PETERS',
  },

  imageResolutionCaption:
    'Audi Forum, Ingolstadt — laufendes TGA-Gebäudemanagement durch GEBRÜDER PETERS.',

  ergebnis: {
    rows: [
      { label: 'Excel-Listen für Stücklisten',   ist: '7 parallel',  ziel: '1 master (ERP)' },
      { label: 'Sync-Arbeit pro Woche',          ist: '11.4 h',       ziel: '~1.5 h projiziert' },
      { label: 'Manuelle Übergaben pro Auftrag', ist: '4',            ziel: '0' },
      { label: 'Disposition-Quellen aktiv',      ist: '3 parallel',   ziel: '1 primary' },
    ],
    saving: '~24.700 € / disposition / jahr',
    savingCaption: 'projizierte Einsparung · gemessen in der Diagnose-Phase Q1 2026, hochgerechnet auf 12 Monate',
  },
};

const SUPPORTING = [
  {
    caseNo: '02',
    status: 'IMPLEMENTIERT Q4 2025',
    meta: 'BAUHANDWERK · SANITÄR · 22 MA · 1 STANDORT',
    headline: 'Die Materialliste, die im Lager nie ankam.',
    summary:
      'Außenmonteure starteten morgens mit handgeschriebenen Materiallisten, die der Lagerist nicht zuordnen konnte. Disposition organisierte täglich nach. Heute: digitalisiertes Material-Briefing, Lager-Sync, ein einziger Datenstand zwischen Werkstatt und Außendienst.',
    delta: '−5.8 h / woche · pro monteur',
    pattern: 'MUSTER 03 · WhatsApp-Auftragsstrom',
  },
  {
    caseNo: '03',
    status: 'IMPLEMENTIERT Q1 2026',
    meta: 'FERTIGUNG · MASCHINENBAU · 64 MA',
    headline: 'Die Freigabe, die niemand traut zu erteilen.',
    summary:
      'Angebote über 25 k€ hingen tagelang in der Schwebe — GF nicht erreichbar, niemand traute Entscheidungen ohne ihn. Heute: definierte Freigabe-Schwellen, automatische Eskalation, Liegezeit minus 78 %.',
    delta: '−4.2 h / woche · entscheidungsstau',
    pattern: 'MUSTER 02 · Telefon-Disposition',
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function StoriesSection() {
  const sectionRef  = useRef(null);
  const headlineRef = useLineReveal('top 72%');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Bilder fade-in mit leichtem Scale-Down (gleiche Bewegung wie ManifestoSection-Foto)
      gsap.utils.toArray('[data-case-image]').forEach((img) => {
        gsap.fromTo(
          img,
          { opacity: 0, scale: 1.04 },
          {
            opacity: 1, scale: 1,
            duration: 1.1, ease: 'power3.out',
            scrollTrigger: { trigger: img, start: 'top 82%', once: true },
          }
        );
      });

      // Block-Aufstieg (befund, ergebnis, supporting cards)
      gsap.utils.toArray('[data-case-block]').forEach((block) => {
        gsap.fromTo(
          block,
          { y: 28, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: block, start: 'top 84%', once: true },
          }
        );
      });

      // Pull-Quote orange Bar zieht von oben aus
      gsap.utils.toArray('[data-quote-bar]').forEach((bar) => {
        gsap.fromTo(
          bar,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.8, ease: 'power3.out',
            transformOrigin: 'top center',
            scrollTrigger: { trigger: bar, start: 'top 80%', once: true },
          }
        );
      });

      // Pattern-Listenpunkte stagger — gibt dem Befund-Block einen Rhythmus
      gsap.utils.toArray('[data-pattern-row]').forEach((row, i) => {
        gsap.fromTo(
          row,
          { x: 12, opacity: 0 },
          {
            x: 0, opacity: 1,
            duration: 0.6, delay: i * 0.08, ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 86%', once: true },
          }
        );
      });

      // Ergebnis-Rows stagger
      gsap.utils.toArray('[data-result-row]').forEach((row, i) => {
        gsap.fromTo(
          row,
          { x: 12, opacity: 0 },
          {
            x: 0, opacity: 1,
            duration: 0.6, delay: i * 0.08, ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 86%', once: true },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
      {/* Section-Header */}
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
        </p>
      </div>

      <FeaturedCase data={FEATURED} />

      {/* Supporting Cases Header */}
      <div className="max-w-6xl mx-auto mt-32 md:mt-40">
        <div
          className="mono-eyebrow mb-3"
          style={{ color: 'var(--fg-muted)', letterSpacing: '0.18em' }}
        >
          → weitere fälle
        </div>
        <p
          className="font-mono mb-12 max-w-md"
          style={{ fontSize: '13px', color: 'var(--fg-muted)', letterSpacing: '0.02em', lineHeight: 1.55 }}
        >
          Pseudonymisiert, mathematisch real. Diese beiden Fälle sind bereits
          implementiert; die Zahlen sind gemessen, nicht projiziert.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {SUPPORTING.map((c) => <SupportingCase key={c.caseNo} data={c} />)}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED CASE — Editorial Foto-Strecke
// ─────────────────────────────────────────────────────────────────────────────

function FeaturedCase({ data }) {
  return (
    <article className="max-w-6xl mx-auto">
      {/* Case-Header — Klarname + Meta */}
      <header className="max-w-3xl mb-14 md:mb-20" data-case-block style={{ opacity: 0 }}>
        <div
          className="flex items-center gap-3 font-mono text-[11px] mb-7"
          style={{ letterSpacing: '0.18em' }}
        >
          <span style={{ color: '#D4571B' }}>FALL.{data.caseNo}</span>
          <span style={{ color: 'var(--line-strong)' }}>·</span>
          <span style={{ color: 'var(--fg-muted)' }}>{data.status}</span>
        </div>
        <h3
          className="editorial-display whitespace-pre-line"
          style={{
            fontSize: 'clamp(28px, 4vw, 52px)',
            lineHeight: 1.1,
            letterSpacing: '-0.015em',
          }}
        >
          {data.headline}
        </h3>
        <div className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span
            className="font-mono"
            style={{ fontSize: '12px', color: 'var(--fg)', letterSpacing: '0.08em' }}
          >
            {data.client}
          </span>
          <span style={{ color: 'var(--line-strong)' }}>·</span>
          <span
            className="font-mono"
            style={{ fontSize: '11px', color: 'var(--fg-muted)', letterSpacing: '0.12em' }}
          >
            {data.meta}
          </span>
        </div>
      </header>

      {/* HERO IMAGE */}
      <CaseImage
        src={data.imageHero || GP_IMAGES.hero}
        alt={data.imageHeroCaption}
        caption={data.imageHeroCaption}
        aspectRatio="16 / 9"
        marginBottom="mb-14 md:mb-24"
      />

      {/* BEFUND BLOCK */}
      <div
        className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 mb-14 md:mb-20"
        data-case-block
        style={{ opacity: 0 }}
      >
        <div className="md:col-span-3">
          <div className="mono-eyebrow" style={{ color: '#D4571B', letterSpacing: '0.18em' }}>
            → DIAGNOSE
          </div>
        </div>
        <div className="md:col-span-9">
          <p
            className="editorial-display"
            style={{
              fontSize: 'clamp(18px, 2vw, 22px)',
              lineHeight: 1.5,
              fontWeight: 400,
            }}
          >
            {data.befund.intro}
          </p>
          <div className="mt-10 space-y-7">
            {data.befund.patterns.map((p, i) => (
              <div
                key={i}
                data-pattern-row
                className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 pb-6"
                style={{
                  borderBottom: i < data.befund.patterns.length - 1 ? '0.5px solid var(--line)' : 'none',
                  opacity: 0,
                }}
              >
                <div
                  className="md:col-span-3 font-mono text-[10px]"
                  style={{ color: '#D4571B', letterSpacing: '0.18em', paddingTop: '4px' }}
                >
                  {p.code}
                </div>
                <div className="md:col-span-9">
                  <div
                    className="editorial-display mb-2"
                    style={{ fontSize: '20px', fontStyle: 'italic', fontWeight: 300 }}
                  >
                    {p.name}
                  </div>
                  <p
                    className="font-mono"
                    style={{
                      fontSize: '13px',
                      lineHeight: 1.65,
                      color: 'var(--fg-muted)',
                      maxWidth: '52ch',
                    }}
                  >
                    {p.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SCHMERZ IMAGE */}
      <CaseImage
        src={data.imageSchmerz || GP_IMAGES.schmerz}
        alt={data.imageSchmerzCaption}
        caption={data.imageSchmerzCaption}
        aspectRatio="4 / 3"
        marginBottom="mb-14 md:mb-20"
        maxWidth="max-w-4xl"
      />

      {/* PULL QUOTE */}
      <div
        className="mb-14 md:mb-20 max-w-3xl mx-auto"
        data-case-block
        style={{ opacity: 0 }}
      >
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-1 md:col-span-1 flex justify-center">
            <div
              data-quote-bar
              style={{
                width: '2px',
                background: '#D4571B',
                alignSelf: 'stretch',
                transformOrigin: 'top center',
              }}
            />
          </div>
          <div className="col-span-11">
            <blockquote
              className="editorial-display"
              style={{
                fontSize: 'clamp(20px, 2.6vw, 30px)',
                lineHeight: 1.4,
                fontStyle: 'italic',
                fontWeight: 300,
                margin: 0,
                color: 'var(--fg)',
              }}
            >
              „{data.pullQuote.text}"
            </blockquote>
            <div
              className="mt-6 font-mono"
              style={{ fontSize: '11px', color: 'var(--fg-muted)', letterSpacing: '0.12em' }}
            >
              → {data.pullQuote.attribution}
            </div>
          </div>
        </div>
      </div>

      {/* RESOLUTION IMAGE */}
      <CaseImage
        src={data.imageResolution || GP_IMAGES.resolution}
        alt={data.imageResolutionCaption}
        caption={data.imageResolutionCaption}
        aspectRatio="21 / 9"
        marginBottom="mb-14 md:mb-20"
      />

      {/* ERGEBNIS */}
      <div
        className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10"
        data-case-block
        style={{ opacity: 0 }}
      >
        <div className="md:col-span-3">
          <div className="mono-eyebrow" style={{ color: '#D4571B', letterSpacing: '0.18em' }}>
            → MESSUNG · IST vs. ZIEL
          </div>
        </div>
        <div className="md:col-span-9">
          <div className="space-y-0">
            {data.ergebnis.rows.map((r, i) => (
              <div
                key={i}
                data-result-row
                className="grid grid-cols-12 gap-2 md:gap-4 py-4"
                style={{
                  borderBottom: '0.5px solid var(--line)',
                  borderTop: i === 0 ? '0.5px solid var(--line)' : 'none',
                  opacity: 0,
                }}
              >
                <div
                  className="col-span-12 md:col-span-5 font-mono"
                  style={{ fontSize: '12px', color: 'var(--fg-muted)', letterSpacing: '0.04em' }}
                >
                  {r.label}
                </div>
                <div
                  className="col-span-5 md:col-span-3 font-mono"
                  style={{
                    fontSize: '13px',
                    color: 'var(--fg-muted)',
                    textDecoration: 'line-through',
                  }}
                >
                  {r.ist}
                </div>
                <div
                  className="col-span-1 md:col-span-1 font-mono text-center"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  →
                </div>
                <div
                  className="col-span-6 md:col-span-3 editorial-display"
                  style={{
                    fontSize: '15px',
                    color: '#D4571B',
                    fontStyle: 'italic',
                    lineHeight: 1.3,
                  }}
                >
                  {r.ziel}
                </div>
              </div>
            ))}
          </div>
          {/* Saving callout */}
          <div className="mt-10 pt-8" style={{ borderTop: '0.5px solid var(--line-strong)' }}>
            <div
              className="mono-eyebrow mb-4"
              style={{ color: 'var(--fg-muted)', letterSpacing: '0.18em' }}
            >
              → projizierte einsparung
            </div>
            <div
              className="editorial-display"
              style={{
                fontSize: 'clamp(28px, 3.6vw, 44px)',
                color: '#D4571B',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
              }}
            >
              {data.ergebnis.saving}
            </div>
            <p
              className="mt-3 font-mono"
              style={{
                fontSize: '11px',
                color: 'var(--fg-muted)',
                letterSpacing: '0.04em',
                lineHeight: 1.55,
                maxWidth: '52ch',
                fontStyle: 'italic',
              }}
            >
              {data.ergebnis.savingCaption}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CASE IMAGE — wiederverwendbare Bild+Caption-Box
// ─────────────────────────────────────────────────────────────────────────────

function CaseImage({ src, alt, caption, aspectRatio, marginBottom = '', maxWidth = '' }) {
  return (
    <figure className={`${marginBottom} ${maxWidth} ${maxWidth ? 'mx-auto' : ''}`}>
      <div
        data-case-image
        className="relative overflow-hidden"
        style={{
          aspectRatio,
          background: '#E5E1D8', // Mist-Fallback während Lade-Phase
          opacity: 0,
        }}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            display: 'block',
          }}
        />
      </div>
      <figcaption
        className="mt-4 font-mono"
        style={{
          fontSize: '11px',
          color: 'var(--fg-muted)',
          letterSpacing: '0.04em',
          lineHeight: 1.55,
        }}
      >
        → {caption}
      </figcaption>
    </figure>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUPPORTING CASE — kompakte Karte, text-only, dichter
// ─────────────────────────────────────────────────────────────────────────────

function SupportingCase({ data }) {
  return (
    <article
      data-case-block
      className="flex flex-col h-full"
      style={{
        opacity: 0,
        paddingTop: '32px',
        borderTop: '0.5px solid var(--line-strong)',
      }}
    >
      {/* Top: case number + status */}
      <div
        className="flex items-center gap-3 font-mono text-[11px] mb-5"
        style={{ letterSpacing: '0.18em' }}
      >
        <span style={{ color: '#D4571B' }}>FALL.{data.caseNo}</span>
        <span style={{ color: 'var(--line-strong)' }}>·</span>
        <span style={{ color: 'var(--fg-muted)' }}>{data.status}</span>
      </div>

      {/* Meta */}
      <div
        className="font-mono mb-6"
        style={{
          fontSize: '11px',
          color: 'var(--fg-muted)',
          letterSpacing: '0.12em',
          lineHeight: 1.55,
        }}
      >
        {data.meta}
      </div>

      {/* Headline */}
      <h4
        className="editorial-display mb-6"
        style={{
          fontSize: 'clamp(22px, 2.4vw, 30px)',
          lineHeight: 1.2,
          fontStyle: 'italic',
          fontWeight: 300,
          letterSpacing: '-0.01em',
        }}
      >
        {data.headline}
      </h4>

      {/* Pattern reference */}
      <div
        className="font-mono mb-5"
        style={{
          fontSize: '10px',
          color: 'var(--fg-muted)',
          letterSpacing: '0.18em',
        }}
      >
        → {data.pattern}
      </div>

      {/* Summary */}
      <p
        style={{
          fontSize: '14px',
          lineHeight: 1.65,
          color: 'var(--fg)',
          maxWidth: '50ch',
        }}
      >
        {data.summary}
      </p>

      {/* Spacer */}
      <div className="flex-1 min-h-[24px]" />

      {/* Delta footer */}
      <div className="pt-6" style={{ borderTop: '0.5px solid var(--line)' }}>
        <div
          className="mono-eyebrow mb-2"
          style={{ color: 'var(--fg-muted)', letterSpacing: '0.18em' }}
        >
          → gemessen
        </div>
        <div
          className="editorial-display"
          style={{
            fontSize: 'clamp(20px, 2.2vw, 28px)',
            color: '#D4571B',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}
        >
          {data.delta}
        </div>
      </div>
    </article>
  );
}
