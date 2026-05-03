// AudioManager — Stub für späteres Sound-Layer.
// Die Choreografie ruft trigger(eventName) auf, aktuell passiert nichts.
// Wenn Sound nachgerüstet wird, hier File-Mapping ergänzen und play() aktivieren.

const SOUND_EVENTS = {
  akt1Enter:       null, // sanfter Atmo-Layer
  shadowBloom:     null, // Papierrascheln + leichter Whoosh
  countertick:     null, // mechanisches Tickern
  akt4Resolution:  null, // Ruhe-Tone
};

let enabled = false;

export const audio = {
  enable() { enabled = true; },
  disable() { enabled = false; },
  isEnabled() { return enabled; },
  trigger(eventName) {
    if (!enabled) return;
    const file = SOUND_EVENTS[eventName];
    if (!file) return;
    // Placeholder — später: new Audio(file).play().catch(() => {});
  },
};
