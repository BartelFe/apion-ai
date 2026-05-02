import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { bgModes } from '../lib/tokens';

gsap.registerPlugin(ScrollTrigger);

/**
 * Global background layer behind the entire site.
 * Only animates the background gradient — text colors (--fg, --fg-muted)
 * are controlled by each section via inline style overrides.
 * This prevents the zero-contrast moment that occurs when --fg and
 * the background color both sit at mid-values during a tween.
 */
export default function BgStage() {
  const stageRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;

    const tweenTo = (mode) => {
      const m = bgModes[mode] || bgModes.light;
      gsap.to(root, {
        duration: 0.4,
        ease: 'power2.out',
        '--bg-center': m.center,
        '--bg-edge': m.edge,
        overwrite: 'auto',
      });
    };

    tweenTo('light');

    const sections = document.querySelectorAll('[data-bg]');
    const triggers = [];

    sections.forEach((sec) => {
      const mode = sec.getAttribute('data-bg');
      const t = ScrollTrigger.create({
        trigger: sec,
        start: 'top 95%',
        end: 'bottom 5%',
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
