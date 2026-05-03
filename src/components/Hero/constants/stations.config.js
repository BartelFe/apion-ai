// Stationen-Topologie für die TGA-Welt.
// Position liegt in Welt-Koordinaten (x, z = horizontal). y wird vom Building gesetzt.
// Tool-Sticker erscheinen als Sprite über jedem Gebäude.
//
// Branche: Technische Gebäudeausrüstung (TGA) — Validierungspflichtig mit Kunde.

export const STATIONS = [
  {
    id: 'anfrage',
    label: 'Anfrage',
    sub: 'Bauträger · Architekten',
    pos: [-7.5, 0, -4.5],
    size: [1.6, 0.9, 1.1],
    tools: ['Outlook', 'Telefon', 'Webformular'],
    color: 'paper',
  },
  {
    id: 'aufmass',
    label: 'Aufmaß',
    sub: 'Vor-Ort-Erfassung',
    pos: [-2.5, 0, -5.5],
    size: [1.2, 0.7, 1.2],
    tools: ['Klemmbrett', 'mh-software', 'Stift+Papier'],
    color: 'paper',
  },
  {
    id: 'kalkulation',
    label: 'Kalkulation',
    sub: 'Angebotserstellung',
    pos: [3.0, 0, -4.5],
    size: [1.6, 1.1, 1.1],
    tools: ['Streit V.1', 'Excel', 'LINEAR'],
    color: 'paper',
  },
  {
    id: 'disposition',
    label: 'Disposition',
    sub: 'Der Knoten',
    pos: [0, 0, 0],
    size: [2.4, 1.4, 2.4],
    tools: ['Whiteboard', 'Outlook', 'Excel', 'Telefon'],
    color: 'paper',
    isHub: true,
  },
  {
    id: 'lager',
    label: 'Lager / Großhandel',
    sub: 'Material',
    pos: [-6.5, 0, 4.0],
    size: [2.2, 0.8, 1.6],
    tools: ['GC-Gruppe', 'Richter+Frenzel', 'IDS-Connect'],
    color: 'paper',
  },
  {
    id: 'baustelle',
    label: 'Baustelle',
    sub: 'Ausführung',
    pos: [4.5, 0, 4.5],
    size: [1.8, 0.9, 1.4],
    tools: ['WhatsApp', 'Streit Mobile', 'Foto'],
    color: 'paper',
  },
  {
    id: 'abrechnung',
    label: 'Abrechnung',
    sub: 'Abschluss',
    pos: [8.5, 0, 1.0],
    size: [1.4, 1.0, 1.0],
    tools: ['DATEV', 'Lexware', 'Excel'],
    color: 'paper',
  },
];

export const stationById = (id) => STATIONS.find((s) => s.id === id);
