const constants = {
  boardMember: 'Styrelsemedlem',
  admin: 'Admin',
  treasurer: 'Kassör',
  inactive: 'Inaktiv',
  soprano1: 'Sopran 1',
  soprano2: 'Sopran 2',
  alto1: 'Alt 1',
  alto2: 'Alt 2',
  conductor: 'Dirigent',
  notes: 'Noter',
  images: 'Bilder',
  audioFiles: 'Ljudfiler',
  documents: 'Dokument',
  current: 'Aktuellt',
  currentAudioFiles: 'Aktuella ljudfiler',
  other: 'Övrigt',
};

constants.tagValues = [
  constants.boardMember,
  constants.admin,
  constants.treasurer,
  constants.inactive,
];

constants.partValues = [
  constants.soprano1,
  constants.soprano2,
  constants.alto1,
  constants.alto2,
  constants.conductor,
];

constants.fileTypes = [
  constants.notes,
  constants.images,
  constants.audioFiles,
  constants.documents,
  constants.other,
];

constants.fileCategories = [
  'Fest',
  'Jul',
  'Lucia',
  'Sommar',
  'Valborg',
  'Världens barn',
];

constants.fileTags = [
  {
    name: 'Allmänna',
    tags: ['Valborg', 'Lucia'],
  },
  {
    name: 'VT24',
    tags: [
      'VT24 Valborg',
      'VT24 Nationaldag',
      'VT24 Konsert',
      'VT24 Kumla',
    ],
  },
  {
    name: 'HT23',
    tags: [
      'HT23 Jul',
      'HT23 Lucia',
      'HT23 Gig',
      'HT23 Övrigt',
    ],
  },
  {
    name: 'VT23',
    tags: [
      'VT23 Valborg',
      'VT23 Gudstjänst',
      'VT23 Konsert',
      'VT23 Resa',
    ],
  },
  {
    name: 'HT22',
    tags: [
      'HT22 Världens barn',
      'HT22 Lucia',
      'HT22 Jul',
      'HT22 Gig',
      'HT22 Övrigt',
    ],
  },
  {
    name: 'VT22',
    tags: [
      'VT22 Konsert',
      'VT22 Nationaldag',
      'VT22 Övrigt',
    ],
  },
  {
    name: 'HT21',
    tags: [
      'HT21 Världens barn',
      'HT21 Jul1',
      'HT21 Lucia',
      'HT21 Nikolai',
      'HT21 Gig',
      'HT21 Övrigt',
    ],
  },
  {
    name: 'VT21',
    tags: ['VT21 Disco', 'VT21 Nationaldag'],
  },
  {
    name: 'HT20',
    tags: [
      'HT20 Världens barn',
      'HT20 Lucia',
      'HT20 Julpaket 1',
      'HT20 Julpaket 2',
    ],
  },
];

export default constants;
