import firebase from 'firebase';
import settings from './settings.json';


var config = {
	apiKey: settings.firebase.apiKey,
    authDomain: settings.firebase.authDomain,
    databaseURL: settings.firebase.databaseURL,
    projectId: settings.firebase.projectId,
    storageBucket: settings.firebase.storageBucket,
    messagingSenderId: settings.firebase.messagingSenderId,
};
var firebaseApp = firebase.initializeApp(config);
firebaseApp.customSettings = settings.customSettings;

export default firebaseApp;