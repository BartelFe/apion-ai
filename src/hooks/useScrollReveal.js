import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useLineReveal(start = 'top 80%') {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const lines = el.querySelectorAll('.reveal-line > span');
      if (!lines.length) return;
      gsap.fromTo(
        lines,
        { y: 0, yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.13,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start, once: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [start]);

  return ref;
}

export function useFadeUp(start = 'top 85%', delay = 0) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start, once: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [start, delay]);

  return ref;
}
