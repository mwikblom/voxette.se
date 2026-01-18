export default class CalendarEvent {
  constructor(title: string, startDate: string, startTime: string, endDate: string, endTime: string) {
    this.title = title;
    this.startDate = startDate;
    this.startTime = startTime;
    this.endDate = endDate;
    this.endTime = endTime;
  }

  public title: string;
  public startDate: string;
  public startTime: string;
  public endDate: string;
  public endTime: string;
}
