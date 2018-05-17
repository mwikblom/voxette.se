export default class CalendarEvent {
	constructor(title, startDate, startTime, endDate, endTime){
		this.title = title;
		this.startDate = startDate;
		this.startTime = startTime;
        this.endDate = endDate;
        this.endTime = endTime;
	}
	get Title() { 
		return this.title;
	}
	get StartDate() {
		return this.startDate; 
	}
	get StartTime() {
		return this.startTime;
	}
	get EndDate() {
		return this.endDate;
	}
	get EndTime() {
		return this.endTime;
	}
}