import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { bgModes } from '../lib/tokens';

gsap.registerPlugin(ScrollTrigger);

/**
 * Globaler Hintergrund-Layer hinter der ganzen Site.
 * Jede Sektion mit data-bg="light|vignette|abyss" triggert beim Scrollen
 * einen smoothen Übergang der CSS-Variablen --bg-center, --bg-edge, --fg etc.
 *
 * Die Vignette entsteht aus dem radial-gradient zwischen --bg-center (Mitte)
 * und --bg-edge (Rand). Bei "light" sind beide gleich → flache Fläche.
 * Bei "vignette" ist die Mitte sehr dunkel, die Ränder warm-rauchig.
 * Bei "abyss" sind beide gleich-schwarz → uniform tief.
 */
export default function BgStage() {
  const stageRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;

    // Smooth tween der CSS-Variablen
    const tweenTo = (mode) => {
      const m = bgModes[mode] || bgModes.light;
      gsap.to(root, {
        duration: 0.9,
        ease: 'power2.inOut',
        '--bg-center': m.center,
        '--bg-edge': m.edge,
        '--fg': m.fg,
        '--fg-muted': m.fgMuted,
        '--line': m.line,
        '--line-strong': m.lineStrong,
        overwrite: 'auto',
      });
    };

    // Initialer Mode
    tweenTo('light');

    // ScrollTrigger pro Sektion
    const sections = document.querySelectorAll('[data-bg]');
    const triggers = [];

    sections.forEach((sec) => {
      const mode = sec.getAttribute('data-bg');
      const t = ScrollTrigger.create({
        trigger: sec,
        start: 'top 88%',
        end: 'bottom 12%',
        onEnter: () => tweenTo(mode),
        onEnterBack: () => tweenTo(mode),
      });
      triggers.push(t);
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse 90% 70% at 50% 50%, var(--bg-center) 0%, var(--bg-edge) 100%)',
      }}
    />
  );
}
