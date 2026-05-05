// Verbindungen zwischen Stationen.
// VISIBLE = der saubere, offizielle Prozess (graue Pfade).
// SHADOW  = die unsichtbare Realität (orange Pfade), die in keinem
//           Prozessdiagramm auftaucht. Manuelle Übergaben, Doppelpflege,
//           Wartezeiten, Rückläufer.
//
// Jeder Pfad: { from: stationId, to: stationId, label?, kind? }
// kind: 'flow' (gerade), 'split' (teilt sich), 'wait' (Stillstand), 'loop' (Rückläufer)

export const VISIBLE_FLOWS = [
  { from: 'anfrage',    to: 'aufmass'     },
  { from: 'aufmass',    to: 'kalkulation' },
  { from: 'kalkulation',to: 'disposition' },
  { from: 'disposition',to: 'lager'       },
  { from: 'disposition',to: 'baustelle'   },
  { from: 'lager',      to: 'baustelle'   },
  { from: 'baustelle',  to: 'abrechnung'  },
];

export const SHADOW_FLOWS = [
  // Aufmaß-Hölle: Klemmbrett wird manuell in CAD übertragen
  { from: 'aufmass',     to: 'kalkulation', label: 'Klemmbrett → CAD manuell', kind: 'flow' },
  // Kalkulation → Disposition: Streit V.1 wird in Excel kopiert
  { from: 'kalkulation', to: 'disposition', label: 'Streit V.1 → Excel manuell', kind: 'split' },
  // Disposition self-loop: Whiteboard pflegen, ständig.
  // Hinweis: kein label — eine Self-Loop hat keinen visuellen Rendering-Target
  // (kein Endpunkt, an dem ein Text-Sprite haften könnte). Sobald in der Szene
  // ein in-canvas <Text> für Loops gewünscht ist, hier wieder hinzufügen.
  { from: 'disposition', to: 'disposition', kind: 'loop' },
  // Disposition → Lager: per Telefon, kein System
  { from: 'disposition', to: 'lager',       label: 'Material per Telefon', kind: 'flow' },
  // Lager → Baustelle: WhatsApp-Foto, manuelle Bestellung
  { from: 'lager',       to: 'baustelle',   label: 'WhatsApp → Lieferschein Hand', kind: 'split' },
  // Baustelle Wartezeit: GF-Freigabe
  { from: 'baustelle',   to: 'disposition', label: 'Wartezeit · GF-Freigabe', kind: 'wait' },
  // Baustelle → Abrechnung: Stundenzettel Papier
  { from: 'baustelle',   to: 'abrechnung',  label: 'Stundenzettel Papier → Lexware', kind: 'flow' },
  // Rückläufer: Abrechnung schickt fehlende Stunden zurück
  { from: 'abrechnung',  to: 'baustelle',   label: 'Rückläufer · fehlende Std.', kind: 'loop' },
];

// Der konkrete Auftrag, der die Show trägt.
export const NAMED_AUFTRAG = {
  id: 'BV-2419',
  label: 'BV Klinikum Süd · Heizungssanierung',
  volume: '84.000 €',
  enteredAt: '09:14',
  // Pfad durch die Welt — als Sequenz von Station-IDs.
  // Wird in Akt 1 elegant durchlaufen, in Akt 3 zweimal angehalten (waits).
  route: [
    'anfrage',
    'aufmass',
    'kalkulation',
    'disposition',
    'lager',
    'baustelle',
    'abrechnung',
  ],
  // Wartepunkte (Akt 3): an welcher Station wie lange die Uhr tickt
  waits: [
    { at: 'disposition', label: 'Wartezeit · GF-Freigabe',   hours: 4.2 },
    { at: 'lager',       label: 'Wartezeit · Material',      hours: 3.1 },
  ],
};

// HUD-Zielwerte für die Counter (wachsen über die Akte hinweg).
export const COUNTER_TARGETS = {
  uebergaben: 47,
  stundenWoche: 15.6,
  euroJahr: 33800,
  einsparungEuro: 23660,
};
