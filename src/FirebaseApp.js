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

export default firebaseApp;