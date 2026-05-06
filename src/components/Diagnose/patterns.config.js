// Musterdiagnose — die vier Schatten-Muster, die in jedem Mittelständler auftauchen.
//
// Jedes Pattern folgt derselben Struktur: typologie + wiedererkennungs-liste +
// pull-quote + schaden in zahlen. Das ist absichtlich rigide — die Section
// soll sich wie ein Befundbogen anfühlen, nicht wie eine bunte Liste.

export const INTRO = {
  eyebrow: '02 · MUSTERDIAGNOSE',
  headline: 'Wir haben in 47 Mittelständlern\ndenselben Schatten gesehen.',
  sub: 'Vier Muster, immer wieder.',
  caption: '→ Sie kennen mindestens eins.',
};

export const PATTERNS = [
  {
    id: 'crm',
    no: '01',
    eyebrow: 'muster 01 / 04',
    name: 'Der Excel-Schatten-CRM',
    foundIn: [
      'Maschinenbau-Mittelstand > 30 MA',
      'TGA-Betrieben mit Streit V.1',
      'Großhändlern mit Stamm in Sage',
    ],
    feeling: 'Vertrieb pflegt im CRM. Backoffice pflegt in Excel. Niemand vertraut beiden Quellen. Die Wahrheit liegt in einer dritten Datei, die jemand „aktuelle_Liste.xlsx" nennt.',
    damages: [
      { value: '4.2', unit: 'h / mitarbeiter / woche' },
      { value: '~9.100 €', unit: 'mitarbeiter / jahr' },
    ],
    annotation: 'manuelle übergaben pro tag: 12',
  },
  {
    id: 'phone',
    no: '02',
    eyebrow: 'muster 02 / 04',
    name: 'Die Telefon-Disposition',
    foundIn: [
      'Bauhandwerk mit > 8 Monteuren',
      'Sanitär- & Heizungsbau',
      'Tiefbau, Garten- & Landschaftsbau',
    ],
    feeling: 'Die Disposition kennt jeder Lagerist auswendig. Steht nirgendwo geschrieben. Wenn Frau Schmidt urlaubsbedingt ausfällt, wissen die Monteure morgens nicht, wo sie hinsollen.',
    damages: [
      { value: '3.7', unit: 'h telefonzeit / tag' },
      { value: '~14.300 €', unit: 'disposition / jahr' },
    ],
    annotation: 'verbal-kopplung statt system-kopplung',
  },
  {
    id: 'whatsapp',
    no: '03',
    eyebrow: 'muster 03 / 04',
    name: 'Der WhatsApp-Auftragsstrom',
    foundIn: [
      'Handwerk mit Außenmonteuren',
      'Bau & Sanierung',
      'Service & Wartungstechnik',
    ],
    feeling: 'Der Auftrag existiert offiziell erst, wenn jemand abends die WhatsApps abschreibt. Bis dahin lebt er in 47 verschiedenen Telefonen, in 12 verschiedenen Sprachvariationen, in keiner einzigen Datenbank.',
    damages: [
      { value: '47', unit: 'nachrichten / auftrag' },
      { value: '0', unit: 'davon strukturiert erfasst' },
    ],
    annotation: 'medien-bruch zwischen baustelle und ERP',
  },
  {
    id: 'whiteboard',
    no: '04',
    eyebrow: 'muster 04 / 04',
    name: 'Die Drei-Quellen-Sync',
    foundIn: [
      'Disposition & Werkstatt-Planung',
      'Fertigungs-Mittelstand',
      'Wartungs- & Servicebetriebe',
    ],
    feeling: 'Whiteboard im Büro, Excel auf dem Server, Outlook-Kalender in der Cloud. Drei Wahrheiten parallel, alle leicht unterschiedlich. Wer die richtige sehen will, fragt jemanden — und hofft auf den richtigen Tag.',
    damages: [
      { value: '8.4', unit: 'h sync-arbeit / woche' },
      { value: '3', unit: 'parallele wahrheiten' },
    ],
    annotation: 'redundanz ohne master-quelle',
  },
];

export const OUTRO = {
  eyebrow: '→ die summe',
  headline: 'Vier Muster.\nEins davon ist gerade\nin Ihrem Betrieb am wirken.',
  sub: 'Sie wissen, welches.',
  next: '→ was kostet er?',
};
