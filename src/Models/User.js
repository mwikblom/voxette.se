import firebase from 'firebase';

export default class User {
    constructor(googleId, displayNameOrUserData, email, picture = '') {

        this.googleId = googleId;

        if (typeof displayNameOrUserData === 'string') {
            const index = displayNameOrUserData.lastIndexOf(' '); 

            this.firstName = index === -1 ? displayNameOrUserData : displayNameOrUserData.substring(0, index);
            this.lastName = index === -1 ? '' : displayNameOrUserData.substring(index + 1, displayNameOrUserData.length);
            this.email = email;    
            this.picture = picture;
        } else {
            this.firstName = displayNameOrUserData.firstName;
            this.lastName = displayNameOrUserData.lastName;
            this.email = displayNameOrUserData.email;
            this.picture = displayNameOrUserData.address;
        }
    }

    get FirstName() { 
        return this.firstName;
    }
    get LastName() {
        return this.lastName; 
    }
    get Email() {
        return this.email;
    }
    get GoogleId() {
        return this.googleId;
    }
    get Picture() {
        return this.picture;
    }
}