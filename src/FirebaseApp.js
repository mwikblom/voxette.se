import firebase from 'firebase';
import config from './config.json';
import constants from './common/Constants';

var firebaseConfig = {
    apiKey: config.firebase.apiKey,
    authDomain: config.firebase.authDomain,
    databaseURL: config.firebase.databaseURL,
    projectId: config.firebase.projectId,
    storageBucket: config.firebase.storageBucket,
    messagingSenderId: config.firebase.messagingSenderId,
};

var firebaseApp = firebase.initializeApp(firebaseConfig);
firebaseApp.customSettings = config.customSettings;

function createFilePointer(fullPath, file, done) {
    const dbPath = voxette.getValidDatabasePathItem(fullPath);
    const fileType = file.type.endsWith('pdf')
        ? constants.notes
        : file.type.startsWith('audio')
            ? constants.audioFiles
            : file.type.startsWith('image')
                ? constants.images
                : constants.other;

    const data = {
        fileType,
        fullPath: fullPath,
        name: file.name,
        nameLowerCase: file.name.toLowerCase(),
        size: file.size,
        type: file.type,
        isCurrent: true,
        tags: [],
        categories: []
    };

    firebase
        .database()
        .ref('files/' + dbPath)
        .set(data, () => {
            done(data);
        });
}

// some Utils
const voxette = {

    getValidDatabasePathItem: (name) => {
        const invalidChars = /[.#$[\]/]/gi; 
        return name.replace(invalidChars, '_');
    },

    fetchFiles: (filterName, filterType, filterIsCurrent, filterTag, filterCategory, done) => {
        var filesRef = firebase
            .database()
            .ref('files')
            .orderByChild('nameLowerCase');
    
        if (filterName) {
            filesRef = filesRef.startAt(filterName);
        } 
        
        filesRef
            .once('value')
            .then((snapshot) => {
                const value = snapshot.val();
                const files = value ? Object.values(value) : [];

                const filteredFiles = files
                    .filter(file => {
                        const { nameLowerCase, tags, categories } = file;
                        let isMatch = true;
                        if (filterName) {
                            isMatch = isMatch && nameLowerCase.startsWith(filterName.toLowerCase());
                        }
                        if (filterType) {
                            isMatch = isMatch && file.fileType  === filterType;
                        }
                        if (filterIsCurrent) {
                            isMatch = isMatch && file.isCurrent;
                        }
                        if (filterCategory) {
                            isMatch = isMatch && categories && categories.includes(filterCategory);
                        }
                        if (filterTag) {
                            isMatch = isMatch && tags && tags.includes(filterTag);
                        }
                        return isMatch;
                    })
                    .sort((a, b) => {
                        return (a.nameLowerCase === b.nameLowerCase) ? 0 : ((a.nameLowerCase < b.nameLowerCase) ? -1 : 1);
                    });                    

                done(filteredFiles);
            });
    },

    // loopAllFileRefs: () => {
    //     var filesRef = firebase
    //         .database()
    //         .ref('files')
    //         // .orderByChild('fullPath')
    //         // .startAt('1583228601633')
    //         .once('value')
    //         .then((snapshot) => {
    //             const value = snapshot.val();
    //             const files = value ? Object.values(value) : [];
    //             for (let i = 0; i < files.length; i++) {
    //                 const file = files[i];
    //                 const isCurrent = file.tags.some(x => x === constants.current || x === constants.currentAudioFiles);
    //                 const fileType = file.tags.find(x => x !== constants.current && x !== constants.currentAudioFiles);
    //                 console.log(file, fileType, isCurrent);
    //                 voxette.saveFileData(file.fullPath.replace('.', '_'), file.name, fileType, isCurrent, [], [], () => {});
    //             }
    //         });
    // },

    fetchFileData: (fullPath, done) => {
        if (fullPath) {
            const dbPath = voxette.getValidDatabasePathItem(fullPath);
            firebase
                .database()
                .ref('files/' + dbPath)
                .once('value')
                .then((snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        done(data);
                    } else {
                        done();
                    }
                });
        } else {
            throw new Error('No full path available for file');
        }
    },

    saveFileData: (fullPath, name, fileType, isCurrent, tags, categories, done) => {
        if (fullPath) {
            const dbPath = voxette.getValidDatabasePathItem(fullPath);
            var updates = {};
            updates['/files/' + dbPath + '/name'] = name;
            updates['/files/' + dbPath + '/nameLowerCase'] = name.toLowerCase();
            updates['/files/' + dbPath + '/fileType'] = fileType;
            updates['/files/' + dbPath + '/isCurrent'] = isCurrent;
            updates['/files/' + dbPath + '/tags'] = tags || [];
            updates['/files/' + dbPath + '/categories'] = categories || [];

            firebase
                .database()
                .ref()
                .update(updates, () => {
                    done();
                });
        } else {
            throw new Error('No full path available for file');
        }
    },

    uploadFile: (fullPath, file, done) => {
        firebase
            .storage()
            .ref()
            .child(fullPath)
            .put(file)
            .then((snapshot) => {
                createFilePointer(fullPath, file, done);
            });
    },

    deleteFile: (fullPath, done) => {
        firebase
            .storage()
            .ref()
            .child(fullPath)
            .delete()
            .then(() => {
                voxette.deleteFileReference(fullPath, done);
            })
            .catch((reason) => {
                console.error(reason);
                voxette.deleteFileReference(fullPath, done);
            });
    },

    deleteFileReference: (fullPath, done) => {
        const dbPath = voxette.getValidDatabasePathItem(fullPath);
        // Remove the file reference in the db
        firebase
            .database()
            .ref('files/' + dbPath)
            .remove()
            .then(() => {
                done();
            })
    },
        
    // loopThroughFiles: () => {

    //     var filesRef = firebase
    //         .database()
    //         .ref('files')
    //         .once('value')
    //         .then((snapshot) => {
    //             const value = snapshot.val();
    //             const fileIds = Object.keys(value);
    //             const files = value ? Object.values(value) : [];
                
    //             for (let i = 0; i < fileIds.length; i++) {
    //                 const fileId = fileIds[i];
    //                 const file = value[fileId];
    //                 console.log(firebase
    //                     .storage()
    //                     .ref()
    //                     .child(fileId));
    //                 // firebase
    //                 //     .storage()
    //                 //     .ref()
    //                 //     .child(fileId)
    //                 //     .listAll()
    //                 //     .then((res) => {
    //                 //         console.log(res);
    //                 //     });
    //             }
                
    //         });
    // },


    getDownloadUrl: (fullPath, done) => {
        firebase
            .storage()
            .ref(fullPath)
            .getDownloadURL()
            .then((url) => {
                done(url);
            });
    },
    
    fetchUserData: (email, done) => {
        if (email) {
            const memberId = voxette.getValidDatabasePathItem(email);
            firebase
                .database()
                .ref('members/' + memberId)
                .once('value')
                .then((snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        done(data.userData);
                    } else {
                        done();
                    }
                });
        } else {
            throw new Error('No email available for user');
        }
    },

    fetchMembers: (filterName, filterTag, filterPart, done) => {
        var membersRef = firebase
            .database()
            .ref('members')
            .orderByChild('userData/firstName');
    
        if (filterName) {
            membersRef = membersRef.startAt(filterName);
        }
        
        membersRef
            .once('value')
            .then((snapshot) => {

                const value = snapshot.val();
                const members = value ? Object.values(value) : [];

                const filteredMembers = members
                    .filter(member => {
                        const { firstName, tags, part } = member.userData;

                        if (filterName && filterTag && filterPart) {
                            return firstName.startsWith(filterName) && tags && tags.includes(filterTag) && part && part.startsWith(filterPart);
                        }
                        if (filterName && filterTag) {
                            return firstName.startsWith(filterName) && tags && tags.includes(filterTag);
                        }
                        if (filterName && filterPart) {
                            return firstName.startsWith(filterName) && part && part.startsWith(filterPart);
                        }
                        if (filterName) {
                            return firstName.startsWith(filterName);
                        }
                        if (filterTag) {
                            return tags && tags.includes(filterTag);
                        }
                        if (filterPart) {
                            return part && part.startsWith(filterPart);
                        }
                        return true;
                    })
                    .sort((a, b) => {
                        return (a.userData.firstName === b.userData.firstName) ? 0 : ((a.userData.firstName < b.userData.firstName) ? -1 : 1);
                    });

                if (filteredMembers) { 
                    done(filteredMembers);
                } 
            });
    },

    addMember: (email, done) => {
        if (email) {
            const memberId = voxette.getValidDatabasePathItem(email);

            voxette.saveUserData(memberId, {
                email: email
            }, done);
        } else {
            throw new Error('No email available for user');
        }
    },

    saveUserData: (memberId, userData, done) => {
        if (memberId && userData) {
            userData.memberId = memberId;

            firebase
                .database()
                .ref('members/' + memberId)
                .set({ userData: userData }, () => {
                    done();
                });
        } else {
            throw new Error('No email available for user');
        }
    },
    
    fetchEventData: (eventId, done) => {
        if (eventId) {
            firebase
                .database()
                .ref('events/' + eventId)
                .once('value')
                .then((snapshot) => {
                    const eventData = snapshot.val() && snapshot.val().eventData;
                    if (eventData) { // prefere the data in our database
                        done(eventData);
                    } else {
                        done();
                    }
                });
        } else {
            throw new Error('No eventId recieved');
        }
    },

    fetchUpcomingEvents: (fromDate, toDate, done) => {
        var ref = firebase
            .database()
            .ref('events')
            .orderByChild('eventData/startDate')
            .startAt(fromDate.toLocaleDateString());
        
        if (toDate) {
            ref = ref.endAt(toDate.toLocaleDateString());
        }

        ref.once('value')
            .then((snapshot) => {
                const events = [];
                
                snapshot.forEach((child) => {
                    events.push(child.val());
                });

                if (events) { // prefere the data in our database
                    done(events);
                } else {
                    done();
                }
            });
    },

    fetchAllEvents: (done) => {
        firebase
            .database()
            .ref('events')
            .once('value')
            .then((snapshot) => {
                const events = snapshot.val();
                if (events) { // prefere the data in our database
                    done(events);
                } else {
                    done();
                }
            });
    },

    addEventData: (eventData, done) => {
        if (eventData) {
            var newEvent = firebase
                .database()
                .ref('events')
                .push({ eventData: eventData }, () => {
                    done(newEvent.key);
                });
            
        } else {
            throw new Error('No eventData to add recieved');
        }
    },

    updateEventData: (eventId, eventData, done) => {
        if (eventId && eventData) {
            eventData.eventId = eventId;

            firebase
                .database()
                .ref('events/' + eventId + '/eventData')
                .set(eventData, () => {
                    done(eventId);
                });
        } else {
            throw new Error('No id or data for event');
        }
    },

    removeEvent: (eventId, done) => {
        if (eventId) {
            firebase
                .database()
                .ref('events/' + eventId)
                .remove(() => {
                    done();
                });
        }
    },

    addEventAttendance: (eventId, memberId, attendance, done) => {
        if (eventId && memberId && attendance) {
            firebase
                .database()
                .ref('events/' + eventId + '/attendance/' + memberId)
                .update(attendance, () => {
                    done(eventId);
                });
        } else {
            throw new Error('No id or data for event');
        }
    },

};

firebaseApp.voxette = voxette;

export default firebaseApp;