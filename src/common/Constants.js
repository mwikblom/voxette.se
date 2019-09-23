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
    other: 'Övrigt'
};

constants.tagValues = [
    constants.boardMember,
    constants.admin,
    constants.treasurer,
    constants.inactive
];

constants.partValues = [
    constants.soprano1,
    constants.soprano2,
    constants.alto1,
    constants.alto2,
    constants.conductor
];

constants.fileTags = [
    constants.notes,
    constants.images,
    constants.audioFiles,
    constants.documents,
    constants.current,
    constants.currentAudioFiles,
    constants.other
];

export default constants;