// APION Brand Tokens — single source of truth
// Hier liegen alle Werte, die sowohl im CSS als auch im JS/R3F gebraucht werden.

export const colors = {
  paper: '#F5F3EE',
  ink: '#0A0A0B',
  trace: '#D4571B',
  steel: '#6E6E70',
  mist: '#E5E1D8',
  // Dunkel-Modi
  abyss: '#08070A',
  ember: '#1A1408',
  paperDim: '#1F1D1A',
};

// Hex zu Three.js Number-Hex
export const c3 = {
  paper: 0xF5F3EE,
  ink: 0x0A0A0B,
  trace: 0xD4571B,
  steel: 0x6E6E70,
  mist: 0xE5E1D8,
  abyss: 0x08070A,
  ember: 0x1A1408,
};

// Background-Modi für die globale BgStage
// Jeder Mode definiert center + edge (für radial-gradient Vignette).
export const bgModes = {
  light: {
    center: '#F5F3EE',
    edge: '#F5F3EE',
    fg: '#0A0A0B',
    fgMuted: '#6E6E70',
    line: 'rgba(10, 10, 11, 0.12)',
    lineStrong: 'rgba(10, 10, 11, 0.35)',
  },
  vignette: {
    // Mitte tief, Ränder warm — die "Taschenlampen"-Atmosphäre
    center: '#08070A',
    edge: '#1A1408',
    fg: '#F5F3EE',
    fgMuted: '#8B847A',
    line: 'rgba(245, 243, 238, 0.14)',
    lineStrong: 'rgba(245, 243, 238, 0.32)',
  },
  abyss: {
    // Voll-schwarz, kein Gradient
    center: '#08070A',
    edge: '#08070A',
    fg: '#F5F3EE',
    fgMuted: '#8B847A',
    line: 'rgba(245, 243, 238, 0.14)',
    lineStrong: 'rgba(245, 243, 238, 0.32)',
  },
};

export const motion = {
  ease: 'power3.out',
  easeReveal: 'power3.inOut',
  durFast: 0.5,
  durBase: 0.8,
  durSlow: 1.2,
  durEpic: 1.6,
};
