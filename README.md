# APION — Der unsichtbare Betrieb

Award-Quality Brand-Site für APION (KI-Prozessautomatisierung für den Mittelstand).

## Brand-These

> **Was unsichtbar war, wird sichtbar — ruhig, präzise, ohne Spektakel.**

Die Site ist nicht *über* APION, sie *macht*, was APION macht: Sie deckt den unsichtbaren Betrieb auf, der jedem Mittelständler die Energie frisst, ohne benannt zu werden.

## Stack

- **Vite 5** + **React 18**
- **Tailwind CSS 3** (Brand-Tokens in `tailwind.config.js`)
- **GSAP 3** + **ScrollTrigger** (Scroll-Choreographie)
- **Lenis** (smooth scroll)
- **Three.js** + **React Three Fiber** + **Drei** (3D-Diagramme)

## Setup

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run preview  # preview the build
```

## Architektur — wie die Hell-Dunkel-Dramaturgie funktioniert

Der Trick steckt in `src/components/BgStage.jsx`. Das ist ein fixed Layer hinter der ganzen Site, dessen Hintergrund per radial-gradient zwischen `--bg-center` und `--bg-edge` gerendert wird.

Jede Sektion deklariert ihren Modus über ein data-Attribut:

```jsx
<section data-bg="light">      {/* helles Paper */}
<section data-bg="vignette">   {/* dunkler Kern, warme Ränder */}
<section data-bg="abyss">      {/* uniform tiefes Schwarz */}
```

Beim Scrollen tweent ein ScrollTrigger smooth zwischen den drei Mustern, indem er die CSS-Variablen animiert. Sektionen sind selbst weitgehend transparent — sie *zeigen* den BgStage, sie überdecken ihn nicht.

Das ist auch der Grund, warum die Übergänge butter-smooth sind: Es gibt kein Section-zu-Section-Cross-Fade, sondern einen einzigen kontinuierlich animierenden Layer.

## Struktur

```
src/
├── App.jsx                       — Komposition
├── main.jsx                      — Entry
├── styles/globals.css            — Tailwind + Brand-Variables + Reveal-Utilities
├── lib/tokens.js                 — Brand-Tokens (Farben, Modi, Motion)
├── hooks/
│   ├── useLenis.js               — Smooth-Scroll Setup
│   └── useScrollReveal.js        — Wiederverwendbare Reveal-Hooks
└── components/
    ├── BgStage.jsx               — Globaler Hintergrund + Modus-Manager
    ├── Nav.jsx                   — Top-Navigation mit Backdrop-Blur
    ├── Logo.jsx                  — APION SVG-Logo
    ├── Hero.jsx                  — Hero mit 3D-Netzwerk
    ├── DiagnoseSection.jsx       — DAS Award-Modul · Pinned Scroll-Build-Up
    ├── ROISection.jsx            — Editorial-ROI-Rechner
    ├── StoriesSection.jsx        — 3 Geschichten in Vignette-Modus
    ├── MethodSection.jsx         — 4-Phasen-Sequenz
    ├── ManifestoSection.jsx      — Brand-Statements mit Dark-Insel
    ├── CollaborationSection.jsx  — Klare Phasen der Zusammenarbeit
    ├── CTASection.jsx            — Finaler CTA in Vignette
    ├── Footer.jsx                — Standard-Footer
    ├── ConsoleBar.jsx            — Live-Ticker am unteren Rand
    └── 3d/
        ├── HeroDiagram.jsx       — 3D-Netzwerk im Hero
        └── DiagnoseDiagram.jsx   — 3D-Netzwerk mit Scroll-Progress
```

## Sektionen-Reihenfolge & Hell-Dunkel-Rhythmus

```
Hero            light       — These einleiten + 3D-Hook
Diagnose        VIGNETTE    — Aufdeckung beim Scrollen (pinned, 400vh)
ROI             light       — In Stunden + Geld übersetzen
Stories         VIGNETTE    — 3 Übeltäter-Geschichten
Method          light       — 4 Phasen sequentiell
Manifesto       light + 1 dunkle Insel
Collaboration   light       — Klarer Einstieg/Ausstieg
CTA             VIGNETTE    — Finaler Schluss-Akkord
Footer          light
```

Anfang und Ende sind ruhig, in der Mitte wird drei Mal aufgedeckt. Genau das, was die Brand-These dramaturgisch verlangt.

## Brand-Disziplin

Drei Regeln, die nie gebrochen werden:

1. **Trace-Orange `#D4571B`** taucht *nur* dort auf, wo etwas Unsichtbares sichtbar wird. Nie als Deko, nie als Fläche.
2. **Diagramme sind Heldenelemente**, keine Beilage. Wenn ein Diagramm da ist, trägt es die Argumentation.
3. **Reveal statt Animate.** Nichts hüpft. Alles wird freigelegt.

## Was als nächstes ansteht

- [ ] Echte Kundenfälle / Zahlen (aktuell sind die Stories realistisch fiktiv — Felix soll mit Alex echte Zahlen ergänzen)
- [ ] Lizenz-Schriften: GT Sectra (Display) und Söhne (Sans) statt der aktuellen Open-Source-Fallbacks (Newsreader / Inter)
- [ ] EN-Sprachversion (Strings extrahieren in `src/lib/i18n.js`)
- [ ] Cal.com Integration im CTA
- [ ] Mobile-Performance des Diagnose-Pin auf realen Geräten messen
- [ ] SEO-Meta + OG-Image
- [ ] Lighthouse-Pass: Bilder optimieren, Three.js lazy-load wenn out-of-viewport

## Performance-Hinweise

- Beide R3F-Canvases (`HeroDiagram`, `DiagnoseDiagram`) rendern eigene Three.js-Szenen. Auf schwachen Geräten ggf. mit IntersectionObserver pausieren wenn nicht im Viewport.
- Die Vignette ist ein einziges fixed Element — kein Performance-Risiko, auch nicht auf Mobile.
- Lenis läuft im RAF, keine zusätzliche Ticker-Last.

## Lizenz

Alle Rechte bei APION. Code-Beitrag von Felix Bartel.
