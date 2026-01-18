export default class DateTimeHelper {
  private static format(value: number) {
    return value < 10 ? `0${value}` : `${value}`;
  }

  public static getCurrentTimestamp() {
    var today = new Date();

    var day = DateTimeHelper.format(today.getDate());
    var month = DateTimeHelper.format(today.getMonth() + 1);
    var year = DateTimeHelper.format(today.getFullYear());

    var hour = DateTimeHelper.format(today.getHours());
    var minutes = DateTimeHelper.format(today.getMinutes());

    return `${year}-${month}-${day} ${hour}:${minutes}`;
  }

  public static getFormattedDate(date: Date) {
    var day = DateTimeHelper.format(date.getDate());
    var month = DateTimeHelper.format(date.getMonth() + 1);

    var year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  public static getTimeNextFullHour(plusHours = 0) {
    var today = new Date();
    var hour = today.getHours() + 1;
    hour += plusHours;
    if (hour > 23) {
      hour = 0;
    }

    return `${DateTimeHelper.format(hour)}:00`;
  }
}
