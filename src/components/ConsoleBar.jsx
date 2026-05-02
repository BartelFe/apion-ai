import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const FEED = [
  { time: '14:32', text: 'übergabe auftrag #4012 → buchhaltung', kind: 'normal' },
  { time: '14:34', text: 'doppelpflege CRM ⇄ branchensoftware erkannt', kind: 'trace' },
  { time: '14:37', text: 'routine kandidat → automatisierung möglich', kind: 'trace' },
  { time: '14:41', text: 'angebot #2207 versendet · disposition', kind: 'normal' },
  { time: '14:43', text: 'manuelle übergabe lager → versand · 12 min', kind: 'trace' },
  { time: '14:46', text: 'auftragsbestätigung an kunde gesendet', kind: 'normal' },
];

export default function ConsoleBar() {
  const trackRef = useRef(null);
  const [num, setNum] = useState(47);

  useEffect(() => {
    const interval = setInterval(() => {
      setNum((n) => {
        const delta = Math.random() < 0.5 ? -1 : 1;
        return Math.max(38, Math.min(58, n + delta));
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const rowHeight = 16;
    const total = FEED.length;
    let offset = 0;

    const interval = setInterval(() => {
      offset++;
      gsap.to(track, {
        y: -(offset % total) * rowHeight,
        duration: 0.8,
        ease: 'power2.inOut',
      });
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed bottom-0 inset-x-0 z-40 px-6 md:px-10 py-3 flex items-center gap-6 md:gap-10 font-mono text-[11px]"
      style={{
        background: '#0A0A0B',
        color: '#F5F3EE',
        letterSpacing: '0.04em',
        borderTop: '0.5px solid #0A0A0B',
      }}
    >
      <div className="flex-1 overflow-hidden h-4 relative">
        <div ref={trackRef} className="absolute inset-x-0 top-0">
          {[...FEED, ...FEED].map((row, i) => (
            <div key={i} className="flex gap-3 h-4 items-center">
              <span style={{ color: '#F5F3EE' }}>{row.time}</span>
              <span style={{ color: '#6E6E70' }}>·</span>
              <span style={{ color: row.kind === 'trace' ? '#D4571B' : 'rgba(245,243,238,0.65)' }}>
                {row.text}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div
        className="flex items-center gap-3 whitespace-nowrap"
        style={{ color: 'rgba(245,243,238,0.65)' }}
      >
        <span className="hidden sm:inline">aktive übergaben</span>
        <span className="font-medium text-[13px] min-w-[28px] text-right" style={{ color: '#D4571B' }}>
          {num}
        </span>
      </div>
    </div>
  );
}
