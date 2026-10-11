export interface Event {
  eventData: CalendarEvent;
  attendance: Attendance;
}

export interface CalendarEvent {
  eventId: string;
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  meetupTime: string;
  location: string;
  hasAttendanceCheck: string;
}

export interface Attendance {
  [memberId: string]: MemberAttendance;
}

export interface MemberAttendance {
  choice?: string;
  part?: string;
  updated: string;
}
