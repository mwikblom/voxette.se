export default class User {
<<<<<<< HEAD
	constructor(firstName, lastName, email, googleId, picture = ''){
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
        this.googleId = googleId;
        this.picture = picture;
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
=======
    constructor(firstName, lastName, email, googleId){
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.googleId = googleId;
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
>>>>>>> 48180bc1dd6edaea02e87534f3cbc0726aff6af4
}