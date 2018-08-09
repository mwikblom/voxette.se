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

    fetchAllFiles: (done) => {

        // TODO attributes to filter files

        console.log('fetching all files');

        firebase
            .database()
            .ref('files')
            .once('value')
            .then((snapshot) => {
                const files = snapshot.val();

                console.log('data: ' + JSON.stringify(files));

                if (files) { 
                    // TODO getDownloadURL().then(function(url) { }

                    done(files);
                } else {
                    console.log('No data available');
                    done();
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
    
    fetchUserData: (googleId, done) => {
        if (googleId) {

            console.log('fetching data for ' + googleId);

            firebase
                .database()
                .ref('members/' + googleId)
                .once('value')
                .then((snapshot) => {
                    const userData = snapshot.val() && snapshot.val().userData;
    
                    console.log('data: ' + JSON.stringify(userData));

                    if (userData) { // prefere the data in our database
                        done(userData);
                    } else {
                        console.log('No data available for ' + googleId);
                        done();
                    }
                });
        } else {
            throw 'No googleId available for user';
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

                if (users) { // prefere the data in our database
                    done(users);
                } else {
                    console.log('No data available');
                    done();
                }
            });
    },

    saveUserData: (googleId, userData, done) => {
        if (googleId && userData) {

            console.log('saving user data for ' + googleId + ' data: ' + JSON.stringify(userData));

            firebase
                .database()
                .ref('members/' + googleId)
                .set({ userData: userData }, () => {
                    console.log('data saved');
                    done();
                });
        } else {
            throw 'No googleId available for user';
        }
    }
};

firebaseApp.voxette = voxette;

export default firebaseApp;