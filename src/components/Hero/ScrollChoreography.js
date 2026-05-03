import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { audio } from './audio/AudioManager';
import { COUNTER_TARGETS } from './constants/flows.config';

gsap.registerPlugin(ScrollTrigger);

// Erstellt die Master-Timeline für die Hero-Komponente.
// Erwartet einen `world`-Ref (mit dem imperativen API aus World.jsx),
// einen `hud`-Ref (Setter für DataHUD-Zahlen), sowie die DOM-Section.
//
// Akt 1 (0–25%): Sichtbar — saubere Pfade, BV-2419 fließt.
// Akt 2 (25–50%): Shadow-Bloom — orange wuchert, Headline-Sync.
// Akt 3 (50–75%): Was es kostet — visible dimt, BV-2419 hängt zweimal.
// Akt 4 (75–100%): Sichtbar gemacht — beide Layer harmonisieren.
export function createHeroChoreography({ section, sticky, world, hud, headline }) {
  if (!section || !sticky || !world) return null;

  // Counter-Proxies (gsap kann beliebige Objekte tweenen)
  const counters = {
    visible:    { v: 0 },
    uebergaben: { v: 0 },
    stunden:    { v: 0 },
    euro:       { v: 0 },
    einsparung: { v: 0 },
  };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=400%',     // 4× Viewport für 4 Akte
      pin: sticky,
      scrub: 1,
      anticipatePin: 1,
    },
    defaults: { ease: 'power2.inOut' },
  });

  const w = () => world();

  // ═══ AKT 1 · So weit, so klar (0 → 1) ═══
  tl.addLabel('akt1', 0)
    .call(() => audio.trigger('akt1Enter'), null, 'akt1')
    // Welt: nur visible Layer, sanfte Auto-Rotation
    .to({}, { duration: 0.05, onUpdate: () => w()?.setCameraOrbit(0.4) }, 'akt1')
    .to({}, {
      duration: 1,
      onUpdate: function () {
        const p = this.progress();
        const wo = w(); if (!wo) return;
        wo.setVisibleLayerOpacity(0.2 + p * 0.8);
        wo.setNamedProgress(p * 0.5);
      },
    }, 'akt1')
    .to(counters.visible, { v: 124, duration: 1, onUpdate: () => hud()?.setVisible(Math.round(counters.visible.v)) }, 'akt1+=0.2');

  // ═══ AKT 2 · Aber sehen Sie das? (1 → 2) ═══
  tl.addLabel('akt2', 1)
    .call(() => {
      audio.trigger('shadowBloom');
      headline()?.triggerBloom?.();
    }, null, 'akt2+=0.15')
    .to({}, {
      duration: 1,
      onUpdate: function () {
        const p = this.progress();
        const wo = w(); if (!wo) return;
        wo.setShadowProgress(p);
        wo.setShadowOpacity(0.92);
        wo.setShadowDash(0.35, 0.30);
        wo.setNamedProgress(0.5 + p * 0.2);
      },
    }, 'akt2')
    .to(counters.uebergaben, {
      v: COUNTER_TARGETS.uebergaben,
      duration: 1,
      onUpdate: () => hud()?.setUebergaben(Math.round(counters.uebergaben.v)),
    }, 'akt2+=0.4');

  // ═══ AKT 3 · Was es wirklich kostet (2 → 3) ═══
  tl.addLabel('akt3', 2)
    .to({}, {
      duration: 1,
      onUpdate: function () {
        const p = this.progress();
        const wo = w(); if (!wo) return;
        wo.setVisibleLayerOpacity(1 - p * 0.85);
        wo.setShadowIntensity(1 + p * 0.6);
        wo.setShadowBurnout(p * 0.35);
        wo.setCameraOrbit(0.4 - p * 0.2);

        if (p < 0.5) {
          wo.setNamedProgress(0.7);
          wo.setNamedStuck(p * 2, 0);
        } else {
          wo.setNamedProgress(0.78);
          wo.setNamedStuck((p - 0.5) * 2, 1);
        }
      },
    }, 'akt3')
    .to(counters.stunden, {
      v: COUNTER_TARGETS.stundenWoche,
      duration: 1,
      onUpdate: () => hud()?.setStunden(counters.stunden.v.toFixed(1)),
    }, 'akt3+=0.2')
    .to(counters.euro, {
      v: COUNTER_TARGETS.euroJahr,
      duration: 1,
      onUpdate: () => hud()?.setEuro(Math.round(counters.euro.v)),
    }, 'akt3+=0.4')
    .call(() => audio.trigger('countertick'), null, 'akt3+=0.5');

  // ═══ AKT 4 · Sichtbar gemacht (3 → 4) ═══
  tl.addLabel('akt4', 3)
    .to({}, {
      duration: 1,
      onUpdate: function () {
        const p = this.progress();
        const wo = w(); if (!wo) return;
        wo.setShadowDash(0.6 + p * 0.4, 0.05);
        wo.setVisibleLayerOpacity(0.15 + p * 0.6);
        wo.setShadowIntensity(1.6 - p * 0.8);
        wo.setShadowBurnout(0.35 - p * 0.35);
        wo.setNamedStuck(0, 0);
        wo.setNamedProgress(0.78 + p * 0.22);
      },
    }, 'akt4')
    .to(counters.einsparung, {
      v: COUNTER_TARGETS.einsparungEuro,
      duration: 1,
      onUpdate: () => hud()?.setEinsparung(Math.round(counters.einsparung.v)),
    }, 'akt4+=0.3')
    .call(() => audio.trigger('akt4Resolution'), null, 'akt4+=0.5');

  return tl;
}
