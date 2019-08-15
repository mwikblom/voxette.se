export default class User {
    constructor(googleId, displayNameOrUserData, email, picture = '') {
        this.googleId = googleId;

        if (typeof displayNameOrUserData === 'string') {
            const index = displayNameOrUserData.lastIndexOf(' '); 

            this.firstName = index === -1 ? displayNameOrUserData : displayNameOrUserData.substring(0, index);
            this.lastName = index === -1 ? '' : displayNameOrUserData.substring(index + 1, displayNameOrUserData.length);
            this.email = email;    
            this.picture = picture;
            this.part = '';
        } else {
            this.firstName = displayNameOrUserData.firstName;
            this.lastName = displayNameOrUserData.lastName;
            this.email = displayNameOrUserData.email;
            this.picture = displayNameOrUserData.pictureUrl;
            this.part = displayNameOrUserData.part;
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
    get Part() {
        return this.part;
    }
    get InitialUserData() {
        return {
            googleId: this.googleId,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            pictureUrl: this.picture
        };
    }
}