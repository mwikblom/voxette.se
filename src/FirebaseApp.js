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

// some Utils
const voxette = {
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
        // TODO attributes which filter a member
        
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