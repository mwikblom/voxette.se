export default class User {
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
}