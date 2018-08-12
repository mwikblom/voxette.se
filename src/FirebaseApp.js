import firebase from 'firebase';
import config from './config.json';

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

    console.log('storing file pointer for ' + fullPath);

    const tags = [];

    // TODO somewhat duplicated with File.js
    if (file.type.endsWith('pdf')) {
        tags.push('Noter');
    } else if (file.type.startsWith('audio')) {
        tags.push('Ljudfiler');
    } else if (file.type.startsWith('image')) {
        tags.push('Bilder');
    } else {
        tags.push('Övrigt');
    }

    firebase
        .database()
        .ref('files/' + fullPath)
        .set({ 
            fullPath: fullPath,
            name: file.name,
            nameLowerCase: file.name.toLowerCase(),
            size: file.size,
            type: file.type,
            tags: tags
        }, () => {
            console.log('file pointer saved');
            done();
        });
}

// some Utils
const voxette = {

    getValidDatabsePathItem: (name) => {
        const invalidChars = /[.#$[\]/]/gi; 
        return name.replace(invalidChars, '_');
    },

    fetchFiles: (filterName, filterTag, done) => {

        console.log('fetching files with filter: ' + filterName + ' ' + filterTag);

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
                        const { nameLowerCase, tags } = file;

                        if (filterName && filterTag) {
                            return nameLowerCase.startsWith(filterName.toLowerCase()) && tags && tags.includes(filterTag);
                        }
                        if (filterName) {
                            return nameLowerCase.startsWith(filterName.toLowerCase());
                        }
                        if (filterTag) {
                            return tags && tags.includes(filterTag);
                        }
                        return true;
                    })
                    .sort((a, b) => {
                        return (a.nameLowerCase === b.nameLowerCase) ? 0 : ((a.nameLowerCase < b.nameLowerCase) ? -1 : 1);
                    });                    

                if (filteredFiles) { 
                    done(filteredFiles);
                } 
            });
    },

    fetchFileData: (fullPath, done) => {
        if (fullPath) {

            console.log('fetching data for ' + fullPath);

            firebase
                .database()
                .ref('files/' + fullPath)
                .once('value')
                .then((snapshot) => {
                    const data = snapshot.val();
    
                    console.log('data: ' + JSON.stringify(data));

                    if (data) {
                        done(data);
                    } else {
                        console.log('No data available for ' + fullPath);
                        done();
                    }
                });
        } else {
            throw new Error('No full path available for file');
        }
    },

    saveFileData: (fullPath, name, tags, done) => {
        if (fullPath) {

            console.log('saving file name and tags for ' + fullPath + ' name: ' + name + ' tags: ' + tags);

            var updates = {};
            updates['/files/' + fullPath + '/name'] = name;
            updates['/files/' + fullPath + '/tags'] = tags;

            firebase
                .database()
                .ref()
                .update(updates, () => {
                    console.log('data saved');
                    done();
                });
        } else {
            throw new Error('No full path available for file');
        }
    },

    uploadFile: (fullPath, file, done) => {

        console.log('uploading file to ' + fullPath);

        firebase
            .storage()
            .ref()
            .child(fullPath)
            .put(file)
            .then((snapshot) => {
                console.log('uploaded a file to ' + fullPath + ' snapshot: ' + snapshot);

                createFilePointer(fullPath, file, done);
            });
    },

    getDownloadUrl: (fullPath, done) => {

        console.log('downloading from ' + fullPath);

        firebase
            .storage()
            .ref(fullPath)
            .getDownloadURL()
            .then((url) => {

                console.log('URL is' + url);

                done(url);
            });
    },
    
    fetchUserData: (email, done) => {
        if (email) {

            const memberId = voxette.getValidDatabsePathItem(email);

            console.log('fetching data for ' + email + ' memberId ' + memberId);

            firebase
                .database()
                .ref('members/' + memberId)
                .once('value')
                .then((snapshot) => {
                    const data = snapshot.val();
    
                    console.log('data: ' + JSON.stringify(data));

                    if (data) {
                        done(data.userData);
                    } else {
                        console.log('No data available for ' + email);
                        done();
                    }
                });
        } else {
            throw new Error('No email available for user');
        }
    },

    fetchMembers: (filterName, filterPart, done) => {

        console.log('fetching members with filter: ' + filterName + ' ' + filterPart);

        var membersRef = firebase
            .database()
            .ref('members');
    
        if (filterName) {
            membersRef = membersRef
                .orderByChild('userData/firstName')
                .startAt(filterName);
        } else if (filterPart) {
            membersRef = membersRef
                .orderByChild('userData/part')
                .startAt(filterPart);
        }
        
        membersRef
            .once('value')
            .then((snapshot) => {

                const value = snapshot.val();
                const members = value ? Object.values(value) : [];

                const filteredMembers = members
                    .filter(member => {

                        if (filterName && filterPart) {
                            return member.userData.firstName.startsWith(filterName) && member.userData.part.startsWith(filterPart);
                        }
                        if (filterName) {
                            return member.userData.firstName.startsWith(filterName);
                        }
                        if (filterPart) {
                            return member.userData.part.startsWith(filterPart);
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
            const memberId = voxette.getValidDatabsePathItem(email);

            voxette.saveUserData(memberId, {
                email: email
            }, done);
        } else {
            throw new Error('No email available for user');
        }
    },

    saveUserData: (memberId, userData, done) => {
        if (memberId && userData) {

            console.log('saving user data for ' + memberId + ' data: ' + JSON.stringify(userData));

            userData.memberId = memberId;

            firebase
                .database()
                .ref('members/' + memberId)
                .set({ userData: userData }, () => {
                    console.log('data saved');
                    done();
                });
        } else {
            throw new Error('No email available for user');
        }
    },
    
    fetchEventData: (eventId, done) => {
        if (eventId) {

            console.log('fetching data for ' + eventId);

            firebase
                .database()
                .ref('events/' + eventId)
                .once('value')
                .then((snapshot) => {
                    const eventData = snapshot.val() && snapshot.val().eventData;
    
                    console.log('data: ' + JSON.stringify(eventData));

                    if (eventData) { // prefere the data in our database
                        done(eventData);
                    } else {
                        console.log('No data available for ' + eventId);
                        done();
                    }
                });
        } else {
            throw new Error('No eventId recieved');
        }
    },

    fetchAllEvents: (done) => {
        console.log('fetching all events');

        firebase
            .database()
            .ref('events')
            .once('value')
            .then((snapshot) => {
                const events = snapshot.val();

                console.log('data: ' + JSON.stringify(events));

                if (events) { // prefere the data in our database
                    done(events);
                } else {
                    console.log('No data available');
                    done();
                }
            });
    },

    addEventData: (eventData, done) => {
        if (eventData) {

            console.log('adding event, data: ' + JSON.stringify(eventData));

            var newEvent = firebase
                .database()
                .ref('events')
                .push({ eventData: eventData });
            
            done(newEvent.key);
        } else {
            throw new Error('No eventData to add recieved');
        }
    }

};

firebaseApp.voxette = voxette;

export default firebaseApp;