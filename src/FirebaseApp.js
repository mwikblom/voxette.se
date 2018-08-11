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

    firebase
        .database()
        .ref('files/' + fullPath)
        .set({ 
            fullPath: fullPath,
            name: file.name,
            size: file.size,
            type: file.type,

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

    fetchFiles: (filterName, filterType, done) => {

        console.log('fetching files with filter: ' + filterName + ' ' + filterType);

        var filesRef = firebase
            .database()
            .ref('files');
    
        if (filterName) {
            filesRef = filesRef
                .orderByChild('name')
                .startAt(filterName);
        } else if (filterType) {
            filesRef = filesRef
                .orderByChild('type')
                .startAt(filterType);
        }
        
        filesRef
            .once('value')
            .then((snapshot) => {
                const value = snapshot.val();
                const files = value ? Object.values(value) : [];

                const filteredFiles = files.filter(file => {
                    if (filterName && filterType) {
                        return file.name.startsWith(filterName) && file.type.startsWith(filterType);
                    }
                    if (filterName) {
                        return file.name.startsWith(filterName);
                    }
                    if (filterType) {
                        return file.type.startsWith(filterType);
                    }
                    return true;
                });

                if (filteredFiles) { 
                    done(filteredFiles);
                } 
            });
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

            const userId = voxette.getValidDatabsePathItem(email);

            console.log('fetching data for ' + email + ' userId ' + userId);

            firebase
                .database()
                .ref('members/' + userId)
                .once('value')
                .then((snapshot) => {
                    const data = snapshot.val();
    
                    console.log('data: ' + JSON.stringify(data));

                    if (data) {
                        if (data.userData) { // prefere the data in our database
                            done(data.userData);
                        } else {
                            done(data); // i.e. no data available - only the member access
                        }
                    } else {
                        console.log('No data available for ' + email);
                        done();
                    }
                });
        } else {
            throw new Error('No email available for user');
        }
    },

    fetchAllMembers: (done) => {
        // TODO attributes to filter members
        
        console.log('fetching all members');

        firebase
            .database()
            .ref('members')
            .once('value')
            .then((snapshot) => {
                const users = snapshot.val();

                console.log('data: ' + JSON.stringify(users));

                if (users) {
                    done(Object.values(users));
                } else {
                    console.log('No data available');
                    done([]);
                }
            });
    },

    saveUserData: (email, userData, done) => {
        if (email && userData) {

            const userId = voxette.getValidDatabsePathItem(email);

            console.log('saving user data for ' + userId + ' data: ' + JSON.stringify(userData));

            firebase
                .database()
                .ref('members/' + userId)
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